<?php

namespace App\Models;

use App\Enums\StatusBayar;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\SoftDelete;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['siswa_id', 'jumlah_sesi', 'sisa_sesi', 'tanggal_mulai', 'status_bayar', 'dibayar_pada'])]
#[SoftDelete]
class PaketSesi extends Model
{
    protected $table = 'paket_sesi';

    protected $casts = [
        'status_bayar' => StatusBayar::class,
        'dibayar_pada' => 'datetime',
    ];

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function notifikasi(): HasMany
    {
        return $this->hasMany(NotifikasiWa::class);
    }
}
