<?php

namespace App\Observers;

use App\Models\NotifikasiWa;
use App\Services\GoogleSheetsService;

class NotifikasiWaObserver
{
    public function __construct(private GoogleSheetsService $sheets) {}

    public function saved(NotifikasiWa $notif): void
    {
        $this->sheets->syncRow('Notifikasi WA', $notif->id, [
            'id'            => $notif->id,
            'siswa'         => $notif->siswa?->nama,
            'nomor_tujuan'  => $notif->nomor_tujuan,
            'sisa_sesi'     => $notif->sisa_sesi_saat_kirim,
            'status'        => $notif->status?->value,
            'dikirim_pada'  => $notif->dikirim_pada?->toDateTimeString(),
        ]);
    }

    public function deleted(NotifikasiWa $notif): void
    {
        $this->sheets->deleteRow('Notifikasi WA', $notif->id);
    }
}
