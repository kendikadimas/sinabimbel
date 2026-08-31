<?php

namespace App\Services;

use App\Enums\NotifStatus;
use App\Models\NotifikasiWa;
use App\Models\Siswa;

/**
 * Buat record pengingat notifikasi WA. Pengiriman dilakukan manual oleh admin
 * via tombol wa.me di halaman Notifikasi. Status 'gagal' = belum dikirim.
 */
class WhatsAppService
{
    public function send(Siswa $siswa, string $pesan, int $sisaSesi): NotifikasiWa
    {
        $nomor = $siswa->nomor_wa_orang_tua ?: $siswa->nomor_wa;
        $paket = $siswa->paketSesi()->where('sisa_sesi', '>', 0)->orderBy('tanggal_mulai')->first();

        return NotifikasiWa::create([
            'siswa_id'            => $siswa->id,
            'paket_sesi_id'       => $paket?->id ?? throw new \RuntimeException('Tidak ada paket sesi aktif'),
            'nomor_tujuan'        => (string) $nomor,
            'isi_pesan'           => $pesan,
            'status'              => NotifStatus::Gagal, // belum dikirim; terkirim = admin klik wa.me
            'sisa_sesi_saat_kirim'=> $sisaSesi,
            'dikirim_pada'        => null,
        ]);
    }
}
