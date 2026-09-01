<?php

namespace App\Observers;

use App\Models\Fee;
use App\Services\GoogleSheetsService;

class FeeObserver
{
    public function __construct(private GoogleSheetsService $sheets) {}

    public function saved(Fee $fee): void
    {
        $presensi = $fee->presensi;
        if (! $presensi) {
            return;
        }

        $this->sheets->syncRow('Presensi', $presensi->id, [
            'id'           => $presensi->id,
            'tutor'        => $presensi->user?->name,
            'siswa'        => $presensi->siswa?->nama,
            'mulai'        => $presensi->mulai,
            'selesai'      => $presensi->selesai,
            'durasi_menit' => $presensi->durasi_menit,
            'materi'       => $presensi->materi,
            'evaluasi'     => $presensi->evaluasi,
            'fee'          => $fee->jumlah,
        ]);
    }
}
