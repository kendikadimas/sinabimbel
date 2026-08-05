<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\SoftDelete;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['user_id', 'siswa_id', 'mulai', 'selesai', 'durasi_menit', 'materi', 'evaluasi', 'status_aktif'])]
#[SoftDelete]
class Presensi extends Model
{
    protected $table = 'presensi';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(Siswa::class);
    }

    public function fee(): HasOne
    {
        return $this->hasOne(Fee::class);
    }

    public function isAktif(): bool
    {
        return $this->selesai === null;
    }
}
