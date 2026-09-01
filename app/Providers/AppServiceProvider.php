<?php

namespace App\Providers;

use App\Models\Fee;
use App\Models\NotifikasiWa;
use App\Models\PaketSesi;
use App\Models\Presensi;
use App\Models\Siswa;
use App\Models\User;
use App\Observers\FeeObserver;
use App\Observers\NotifikasiWaObserver;
use App\Observers\PaketSesiObserver;
use App\Observers\PresensiObserver;
use App\Observers\SiswaObserver;
use App\Observers\UserObserver;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Siswa::observe(SiswaObserver::class);
        User::observe(UserObserver::class);
        PaketSesi::observe(PaketSesiObserver::class);
        Presensi::observe(PresensiObserver::class);
        Fee::observe(FeeObserver::class);
        NotifikasiWa::observe(NotifikasiWaObserver::class);
    }
}
