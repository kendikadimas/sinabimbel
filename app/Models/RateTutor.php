<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'nominal_per_jam'])]
class RateTutor extends Model
{
    protected $table = 'rate_tutor';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
