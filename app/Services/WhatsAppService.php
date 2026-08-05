<?php

namespace App\Services;

use App\Enums\NotifStatus;
use App\Jobs\SendWhatsAppNotification;
use App\Models\NotifikasiWa;
use App\Models\Siswa;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * WhatsApp Cloud API — free tier.
 *
 * Pengiriman di-queue (async) via job SendWhatsAppNotification agar request
 * tidak tertahan menunggu HTTP API WA. Status awal 'diproses', lalu diubah
 * menjadi 'terkirim'/'gagal' oleh job. Jika variabel WA_* belum diisi,
 * pengiriman di-skip dan dicatat 'gagal' (untuk pengembangan tanpa kredensial).
 */
class WhatsAppService
{
    /**
     * Buat record notifikasi & antrekan pengiriman.
     */
    public function send(Siswa $siswa, string $pesan, int $sisaSesi): NotifikasiWa
    {
        $nomor = $siswa->nomor_wa_orang_tua ?: $siswa->nomor_wa;
        $paket = $siswa->paketSesi()->where('sisa_sesi', '>', 0)->orderBy('tanggal_mulai')->first();

        $notif = NotifikasiWa::create([
            'siswa_id' => $siswa->id,
            'paket_sesi_id' => $paket?->id ?? throw new \RuntimeException('Tidak ada paket sesi aktif'),
            'nomor_tujuan' => (string) $nomor,
            'isi_pesan' => $pesan,
            'status' => NotifStatus::Diproses,
            'sisa_sesi_saat_kirim' => $sisaSesi,
            'dikirim_pada' => now(),
        ]);

        SendWhatsAppNotification::dispatch($notif);

        return $notif;
    }

    /**
     * Eksekusi pengiriman ke API WA & perbarui status. Dipanggil job / retry.
     */
    public function sendNow(NotifikasiWa $notif): void
    {
        $token = config('services.whatsapp.token');
        $phoneId = config('services.whatsapp.phone_id');
        $nomorWA = $notif->nomor_tujuan;

        if (! $token || ! $phoneId || ! $nomorWA) {
            $notif->update(['status' => NotifStatus::Gagal]);

            return;
        }

        try {
            $response = Http::withToken($token)
                ->acceptJson()
                ->post("https://graph.facebook.com/v21.0/{$phoneId}/messages", [
                    'messaging_product' => 'whatsapp',
                    'to' => $nomorWA,
                    'type' => 'text',
                    'text' => ['preview_url' => false, 'body' => $notif->isi_pesan],
                ]);

            $notif->update([
                'status' => $response->successful() ? NotifStatus::Terkirim : NotifStatus::Gagal,
                'dikirim_pada' => now(),
            ]);

            if ($response->failed()) {
                Log::warning('WA gagal', ['res' => $response->body()]);
            }
        } catch (\Throwable $e) {
            $notif->update(['status' => NotifStatus::Gagal]);
            Log::warning('WA exception', ['err' => $e->getMessage()]);
        }
    }
}
