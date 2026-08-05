<?php

namespace App\Services;

use App\Models\Fee;
use App\Models\PaketSesi;
use App\Models\Presensi;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PresensiService
{
    public function __construct(private WhatsAppService $whatsapp) {}

    /**
     * Mulai presensi. Gagal jika tutor punya presensi berjalan, siswa bukan
     * ampuannya, atau siswa tidak memiliki sisa sesi.
     */
    public function mulai(User $tutor, int $siswaId): Presensi
    {
        if ($tutor->presensi()->whereNull('selesai')->exists()) {
            throw new \DomainException('Anda masih memiliki presensi yang berjalan.');
        }

        $siswa = Siswa::find($siswaId);

        if (! $siswa || $siswa->tutor_id !== $tutor->id) {
            throw new \DomainException('Siswa bukan ampuannya Anda.');
        }

        $memilikiSisa = $siswa->paketSesi()
            ->where('sisa_sesi', '>', 0)
            ->whereNull('deleted_at')
            ->exists();

        if (! $memilikiSisa) {
            throw new \DomainException('Siswa tidak memiliki sisa sesi. Top-up dulu oleh admin.');
        }

        return DB::transaction(function () use ($tutor, $siswaId) {
            $presensi = Presensi::create([
                'user_id' => $tutor->id,
                'siswa_id' => $siswaId,
                'mulai' => now(),
                'status_aktif' => 1,
            ]);

            return $presensi;
        });
    }

    /**
     * Selesaikan presensi:
     *  - hitung durasi & fee (rate per jam, presisi menit)
     *  - kurangi sisa sesi paket (tertua yang masih >0) sebesar 1
     *  - kirim notifikasi WA jika sisa sesi <= threshold
     */
    public function selesai(Presensi $presensi, ?string $materi = null, ?string $evaluasi = null): Presensi
    {
        if ($presensi->selesai !== null) {
            throw new \DomainException('Presensi sudah diselesaikan.');
        }

        $rate = $presensi->user->rate?->nominal_per_jam;
        if ($rate === null) {
            throw new \DomainException('Rate fee tutor belum diatur.');
        }

        return DB::transaction(function () use ($presensi, $rate, $materi, $evaluasi) {
            $selesai = now();
            $durasiMenit = (int) max(1, $presensi->mulai->diffInMinutes($selesai));
            $maks = (int) config('bimbel.max_durasi_menit', 480);
            $durasiMenit = min($durasiMenit, $maks);
            $fee = round($rate * $durasiMenit / 60, 2);

            $presensi->update([
                'selesai' => $selesai,
                'durasi_menit' => $durasiMenit,
                'materi' => $materi,
                'evaluasi' => $evaluasi,
                'status_aktif' => null,
            ]);

            Fee::create([
                'presensi_id' => $presensi->id,
                'jumlah' => $fee,
                'rate_per_jam' => $rate,
            ]);

            $this->kurangiSisaSesi($presensi->siswa);

            return $presensi;
        });
    }

    /**
     * Kurangi sisa sesi dari paket tertua yang masih punya sisa.
     */
    private function kurangiSisaSesi($siswa): void
    {
        $paket = $siswa->paketSesi()
            ->where('sisa_sesi', '>', 0)
            ->orderBy('tanggal_mulai')
            ->orderBy('id')
            ->lockForUpdate()
            ->first();

        if (! $paket) {
            throw new \DomainException("Siswa {$siswa->nama} tidak memiliki sisa sesi.");
        }

        $paket->decrement('sisa_sesi');

        $this->notifikasiJikaMenipis($paket);
    }

    private function notifikasiJikaMenipis(PaketSesi $paket): void
    {
        $threshold = (int) config('bimbel.notif_threshold', 3);

        if ($paket->sisa_sesi > $threshold) {
            return;
        }

        $sudahDikirim = $paket->notifikasi()
            ->where('sisa_sesi_saat_kirim', $paket->sisa_sesi)
            ->exists();

        if ($sudahDikirim) {
            return;
        }

        $siswa = $paket->siswa;
        $pesan = $this->susunPesan($siswa, $paket->sisa_sesi);

        $this->whatsapp->send($siswa, $pesan, $paket->sisa_sesi);
    }

    private function susunPesan($siswa, int $sisaSesi): string
    {
        $kontakAdmin = config('bimbel.admin_wa_contact', 'admin bimbel');

        return sprintf(
            "Halo %s,\n\nSisa sesi belajar %s tinggal %d sesi.\n\nMohon segera melakukan pembayaran / top-up sesi dengan menghubungi %s. Terima kasih.",
            $siswa->nama_orang_tua ?: 'Orang tua/Wali',
            $siswa->nama,
            $sisaSesi,
            $kontakAdmin,
        );
    }
}
