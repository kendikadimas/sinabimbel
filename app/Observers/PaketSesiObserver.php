<?php

namespace App\Observers;

use App\Models\PaketSesi;
use App\Services\GoogleSheetsService;

class PaketSesiObserver
{
    public function __construct(private GoogleSheetsService $sheets) {}

    public function saved(PaketSesi $paket): void
    {
        $this->sheets->syncRow('Paket Sesi', $paket->id, [
            'id'             => $paket->id,
            'siswa_id'       => $paket->siswa_id,
            'siswa'          => $paket->siswa?->nama,
            'jumlah_sesi'    => $paket->jumlah_sesi,
            'sisa_sesi'      => $paket->sisa_sesi,
            'tanggal_mulai'  => $paket->tanggal_mulai instanceof \Carbon\Carbon
                ? $paket->tanggal_mulai->toDateString()
                : $paket->tanggal_mulai,
            'status_bayar'   => $paket->status_bayar?->value,
        ]);
    }

    public function deleted(PaketSesi $paket): void
    {
        $this->sheets->deleteRow('Paket Sesi', $paket->id);
    }
}
