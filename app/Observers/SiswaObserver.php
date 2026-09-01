<?php

namespace App\Observers;

use App\Models\Siswa;
use App\Services\GoogleSheetsService;

class SiswaObserver
{
    public function __construct(private GoogleSheetsService $sheets) {}

    public function saved(Siswa $siswa): void
    {
        $this->sheets->syncRow('Siswa', $siswa->id, [
            'id'                 => $siswa->id,
            'nama'               => $siswa->nama,
            'kelas'              => $siswa->kelas,
            'mata_pelajaran'     => $siswa->mata_pelajaran,
            'kurikulum'          => $siswa->kurikulum,
            'tutor'              => $siswa->tutor?->name,
            'nomor_wa'           => $siswa->nomor_wa,
            'nomor_wa_orang_tua' => $siswa->nomor_wa_orang_tua,
        ]);
    }

    public function deleted(Siswa $siswa): void
    {
        $this->sheets->deleteRow('Siswa', $siswa->id);
    }
}
