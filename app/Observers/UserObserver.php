<?php

namespace App\Observers;

use App\Models\User;
use App\Services\GoogleSheetsService;

class UserObserver
{
    public function __construct(private GoogleSheetsService $sheets) {}

    public function saved(User $user): void
    {
        if ($user->isAdmin()) {
            return;
        }

        $this->sheets->syncRow('Tutors', $user->id, [
            'id'        => $user->id,
            'name'      => $user->name,
            'email'     => $user->email,
            'nomor_wa'  => $user->nomor_wa,
        ]);
    }

    public function deleted(User $user): void
    {
        if ($user->isAdmin()) {
            return;
        }

        $this->sheets->deleteRow('Tutors', $user->id);
    }
}
