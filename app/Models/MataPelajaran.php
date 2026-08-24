<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['nama'])]
class MataPelajaran extends Model
{
    protected $table = 'mata_pelajaran';
    public function tutors(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'tutor_mata_pelajaran');
    }
}
