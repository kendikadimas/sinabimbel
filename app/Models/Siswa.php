<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\SoftDelete;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['tutor_id', 'nama', 'nomor_grup', 'kelas', 'mata_pelajaran', 'tingkat', 'nomor_wa', 'nama_orang_tua', 'nomor_wa_orang_tua', 'kurikulum'])]
#[SoftDelete]
class Siswa extends Model
{
    protected $table = 'siswa';

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function rateKelas(): BelongsTo
    {
        return $this->belongsTo(RateKelas::class, 'kelas', 'kelas');
    }

    public function paketSesi(): HasMany
    {
        return $this->hasMany(PaketSesi::class);
    }

    public function presensi(): HasMany
    {
        return $this->hasMany(Presensi::class);
    }

    public function getNomorNotifikasiAttribute(): ?string
    {
        return $this->nomor_wa_orang_tua ?: $this->nomor_wa;
    }
}
