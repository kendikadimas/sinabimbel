<?php

namespace App\Services;

use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportService
{
    private const HEADER = [
        'Timestamp',
        'NAMA TUTOR',
        'NAMA SISWA DI GRUP',
        'NOMOR SISWA DI BELAKANG GRUP *jika ada',
        'Kelas',
        'Mata Pelajaran',
        'TINGKAT',
        'TANGGAL',
        'WAKTU',
        'SESI',
        'FEE',
        'MATERI',
        'EVALUASI (WAJIB COPY DARI GRUP)',
        'KURIKULUM (SKIP UNTUK ADULT)',
    ];

    public function rekapPresensi(Collection $presensi, $dari, $sampai): StreamedResponse
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->fromArray(self::HEADER, null, 'A1');

        $row = 2;
        foreach ($presensi as $p) {
            $sesi = '1 SESI';
            $sheet->fromArray([
                $p->created_at?->format('n/j/Y g:i:s'),
                $p->user->name,
                $p->siswa->nama,
                $p->siswa->nomor_grup,
                $p->siswa->kelas,
                $p->siswa->mata_pelajaran,
                $p->siswa->tingkat,
                $p->mulai->format('j F Y'),
                $p->mulai->format('H:i'),
                $sesi,
                $p->fee?->jumlah,
                $p->materi,
                $p->evaluasi,
                $p->siswa->kurikulum,
            ], null, 'A'.$row);
            $row++;
        }

        foreach (range('A', 'N') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        return response()->streamDownload(function () use ($spreadsheet) {
            (new Xlsx($spreadsheet))->save('php://output');
        }, 'rekap-presensi-'.$dari->format('Ymd').'-'.$sampai->format('Ymd').'.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
