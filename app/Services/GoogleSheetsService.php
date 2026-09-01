<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class GoogleSheetsService
{
    private string $spreadsheetId;
    private string $credentialsPath;
    private ?string $accessToken = null;
    private ?int $tokenExpiry = null;

    public function __construct()
    {
        $this->spreadsheetId = config('services.google_sheets.id', '');
        $this->credentialsPath = base_path(config('services.google_sheets.credentials_path', ''));
    }

    /**
     * Sync a row to a sheet tab. Creates tab + header if missing.
     * Finds row by ID in column A, updates if found, appends if not.
     */
    public function syncRow(string $sheet, int $id, array $row): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        try {
            $this->ensureSheetExists($sheet, array_keys($row));
            $rowNumber = $this->findRowById($sheet, $id);

            if ($rowNumber) {
                $this->updateRow($sheet, $rowNumber, array_values($row));
            } else {
                $this->appendRow($sheet, array_values($row));
            }
        } catch (\Throwable $e) {
            Log::warning("GoogleSheets syncRow failed [{$sheet}#{$id}]: " . $e->getMessage());
        }
    }

    /**
     * Delete a row from a sheet tab by ID in column A.
     */
    public function deleteRow(string $sheet, int $id): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        try {
            $rowNumber = $this->findRowById($sheet, $id);
            if (! $rowNumber) {
                return;
            }

            $sheetId = $this->getSheetId($sheet);
            if ($sheetId === null) {
                return;
            }

            $this->batchUpdate([
                'requests' => [[
                    'deleteDimension' => [
                        'range' => [
                            'sheetId'    => $sheetId,
                            'dimension'  => 'ROWS',
                            'startIndex' => $rowNumber - 1,
                            'endIndex'   => $rowNumber,
                        ],
                    ],
                ]],
            ]);
        } catch (\Throwable $e) {
            Log::warning("GoogleSheets deleteRow failed [{$sheet}#{$id}]: " . $e->getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private function isConfigured(): bool
    {
        return $this->spreadsheetId !== '' && file_exists($this->credentialsPath);
    }

    private function findRowById(string $sheet, int $id): ?int
    {
        $values = $this->getColumnA($sheet);

        foreach ($values as $index => $row) {
            if (isset($row[0]) && (int) $row[0] === $id) {
                // +1 because Sheets rows are 1-indexed, +1 to skip header row
                return $index + 2;
            }
        }

        return null;
    }

    private function getColumnA(string $sheet): array
    {
        $token = $this->getAccessToken();
        $client = new Client(['timeout' => 10]);
        $range = urlencode("{$sheet}!A2:A");

        $response = $client->get(
            "https://sheets.googleapis.com/v4/spreadsheets/{$this->spreadsheetId}/values/{$range}",
            ['headers' => ['Authorization' => "Bearer {$token}"]]
        );

        $data = json_decode($response->getBody(), true);

        return $data['values'] ?? [];
    }

    private function ensureSheetExists(string $sheet, array $headers): void
    {
        $token = $this->getAccessToken();
        $client = new Client(['timeout' => 10]);

        // Get spreadsheet metadata to check existing sheets
        $response = $client->get(
            "https://sheets.googleapis.com/v4/spreadsheets/{$this->spreadsheetId}?fields=sheets.properties.title",
            ['headers' => ['Authorization' => "Bearer {$token}"]]
        );

        $data = json_decode($response->getBody(), true);
        $titles = array_column(
            array_column($data['sheets'] ?? [], 'properties'),
            'title'
        );

        if (in_array($sheet, $titles, true)) {
            return;
        }

        // Create the sheet tab
        $this->batchUpdate([
            'requests' => [[
                'addSheet' => ['properties' => ['title' => $sheet]],
            ]],
        ]);

        // Write header row
        $this->updateValues("{$sheet}!A1", [$headers]);
    }

    private function getSheetId(string $sheet): ?int
    {
        $token = $this->getAccessToken();
        $client = new Client(['timeout' => 10]);

        $response = $client->get(
            "https://sheets.googleapis.com/v4/spreadsheets/{$this->spreadsheetId}?fields=sheets.properties",
            ['headers' => ['Authorization' => "Bearer {$token}"]]
        );

        $data = json_decode($response->getBody(), true);

        foreach ($data['sheets'] ?? [] as $s) {
            if ($s['properties']['title'] === $sheet) {
                return $s['properties']['sheetId'];
            }
        }

        return null;
    }

    private function appendRow(string $sheet, array $values): void
    {
        $token = $this->getAccessToken();
        $client = new Client(['timeout' => 10]);
        $range = urlencode("{$sheet}!A1");

        $client->post(
            "https://sheets.googleapis.com/v4/spreadsheets/{$this->spreadsheetId}/values/{$range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS",
            [
                'headers' => [
                    'Authorization' => "Bearer {$token}",
                    'Content-Type'  => 'application/json',
                ],
                'json' => ['values' => [$values]],
            ]
        );
    }

    private function updateRow(string $sheet, int $rowNumber, array $values): void
    {
        $colCount = count($values);
        $lastCol = $this->columnLetter($colCount);
        $range = "{$sheet}!A{$rowNumber}:{$lastCol}{$rowNumber}";

        $this->updateValues($range, [$values]);
    }

    private function updateValues(string $range, array $values): void
    {
        $token = $this->getAccessToken();
        $client = new Client(['timeout' => 10]);
        $encodedRange = urlencode($range);

        $client->put(
            "https://sheets.googleapis.com/v4/spreadsheets/{$this->spreadsheetId}/values/{$encodedRange}?valueInputOption=RAW",
            [
                'headers' => [
                    'Authorization' => "Bearer {$token}",
                    'Content-Type'  => 'application/json',
                ],
                'json' => ['range' => $range, 'majorDimension' => 'ROWS', 'values' => $values],
            ]
        );
    }

    private function batchUpdate(array $body): void
    {
        $token = $this->getAccessToken();
        $client = new Client(['timeout' => 10]);

        $client->post(
            "https://sheets.googleapis.com/v4/spreadsheets/{$this->spreadsheetId}:batchUpdate",
            [
                'headers' => [
                    'Authorization' => "Bearer {$token}",
                    'Content-Type'  => 'application/json',
                ],
                'json' => $body,
            ]
        );
    }

    private function columnLetter(int $colNumber): string
    {
        $letter = '';
        while ($colNumber > 0) {
            $colNumber--;
            $letter = chr(65 + ($colNumber % 26)) . $letter;
            $colNumber = intdiv($colNumber, 26);
        }

        return $letter;
    }

    private function getAccessToken(): string
    {
        if ($this->accessToken && $this->tokenExpiry && time() < $this->tokenExpiry - 60) {
            return $this->accessToken;
        }

        $credentials = json_decode(file_get_contents($this->credentialsPath), true);
        $now = time();

        $header = base64_encode(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
        $payload = base64_encode(json_encode([
            'iss'   => $credentials['client_email'],
            'scope' => 'https://www.googleapis.com/auth/spreadsheets',
            'aud'   => 'https://oauth2.googleapis.com/token',
            'exp'   => $now + 3600,
            'iat'   => $now,
        ]));

        // URL-safe base64
        $header  = rtrim(strtr($header, '+/', '-_'), '=');
        $payload = rtrim(strtr($payload, '+/', '-_'), '=');

        $signingInput = "{$header}.{$payload}";
        openssl_sign($signingInput, $signature, $credentials['private_key'], 'SHA256');
        $encodedSig = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');

        $jwt = "{$signingInput}.{$encodedSig}";

        $client = new Client(['timeout' => 10]);
        $response = $client->post('https://oauth2.googleapis.com/token', [
            'form_params' => [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion'  => $jwt,
            ],
        ]);

        $data = json_decode($response->getBody(), true);

        $this->accessToken = $data['access_token'];
        $this->tokenExpiry = $now + ($data['expires_in'] ?? 3600);

        return $this->accessToken;
    }
}
