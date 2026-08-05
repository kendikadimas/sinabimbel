<?php

namespace App\Models;

use App\Enums\NotifStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['siswa_id', 'paket_sesi_id', 'nomor_tujuan', 'isi_pesan', 'status', 'sisa_sesi_saat_kirim', 'dikirim_pada'])]
class NotifikasiWa extends Model
{
    protected $table = 'notifikasi_wa';

    protected $casts = [
        'status' => NotifStatus::class,
        'dikirim_pada' => 'datetime',
    ];

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function paketSesi(): BelongsTo
    {
        return $this->belongsTo(PaketSesi::class);
    }
}
