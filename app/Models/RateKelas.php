<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['kelas', 'nominal_per_sesi'])]
class RateKelas extends Model
{
    protected $table = 'rate_kelas';

    public function getRateAttribute(): float
    {
        return (float) $this->nominal_per_sesi;
    }
}
