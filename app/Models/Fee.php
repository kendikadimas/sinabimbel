<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['presensi_id', 'jumlah', 'rate_per_sesi'])]
class Fee extends Model
{
    protected $table = 'fee';

    public function presensi(): BelongsTo
    {
        return $this->belongsTo(Presensi::class);
    }
}
