<?php

namespace App\Observers;

use App\Models\Presensi;
use App\Services\GoogleSheetsService;

class PresensiObserver
{
    public function __construct(private GoogleSheetsService $sheets) {}

    public function saved(Presensi $presensi): void
    {
        // fee di-sync oleh FeeObserver setelah Fee::create(), agar kolom fee tidak null
        $this->sheets->syncRow('Presensi', $presensi->id, [
            'id'           => $presensi->id,
            'tutor'        => $presensi->user?->name,
            'siswa'        => $presensi->siswa?->nama,
            'mulai'        => $presensi->mulai,
            'selesai'      => $presensi->selesai,
            'durasi_menit' => $presensi->durasi_menit,
            'materi'       => $presensi->materi,
            'evaluasi'     => $presensi->evaluasi,
            'fee'          => null,
        ]);
    }

    public function deleted(Presensi $presensi): void
    {
        $this->sheets->deleteRow('Presensi', $presensi->id);
    }
}
