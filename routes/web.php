<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TutorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Dashboard utama diarahkan berdasarkan role.
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route(auth()->user()->isAdmin() ? 'admin.dashboard' : 'tutor.dashboard');
    })->name('dashboard');

    Route::prefix('admin')->middleware('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

        Route::get('/tutor', [AdminController::class, 'indexTutor'])->name('tutor.index');
        Route::post('/tutor', [AdminController::class, 'storeTutor'])->name('tutor.store');
        Route::patch('/tutor/{tutor}', [AdminController::class, 'updateTutor'])->name('tutor.update');
        Route::delete('/tutor/{tutor}', [AdminController::class, 'destroyTutor'])->name('tutor.destroy');

        Route::post('/rate-kelas', [AdminController::class, 'storeRateKelas'])->name('rate-kelas.store');
        Route::patch('/rate-kelas/{rateKelas}', [AdminController::class, 'updateRateKelas'])->name('rate-kelas.update');
        Route::delete('/rate-kelas/{rateKelas}', [AdminController::class, 'destroyRateKelas'])->name('rate-kelas.destroy');

        Route::get('/siswa', [AdminController::class, 'indexSiswa'])->name('siswa.index');
        Route::post('/siswa', [AdminController::class, 'storeSiswa'])->name('siswa.store');
        Route::get('/siswa/{siswa}', [AdminController::class, 'showSiswa'])->name('siswa.show');
        Route::patch('/siswa/{siswa}', [AdminController::class, 'updateSiswa'])->name('siswa.update');
        Route::patch('/siswa/{siswa}/tutor', [AdminController::class, 'assignTutor'])->name('siswa.tutor');
        Route::delete('/siswa/{siswa}', [AdminController::class, 'destroySiswa'])->name('siswa.destroy');

        Route::post('/paket', [AdminController::class, 'storePaket'])->name('paket.store');
        Route::post('/paket/{paket}/topup', [AdminController::class, 'topUpPaket'])->name('paket.topup');
        Route::delete('/paket/{paket}', [AdminController::class, 'destroyPaket'])->name('paket.destroy');

        Route::get('/rekap', [AdminController::class, 'rekap'])->name('rekap');
        Route::get('/rekap/export', [AdminController::class, 'exportRekap'])->name('rekap.export');
        Route::patch('/rekap/{presensi}', [AdminController::class, 'updatePresensi'])->name('rekap.presensi.update');

        Route::get('/notifikasi', [AdminController::class, 'notifikasi'])->name('notifikasi');
        Route::post('/notifikasi/{notif}/sent', [AdminController::class, 'markNotifikasiSent'])->name('notifikasi.sent');

        Route::get('/penagihan', [AdminController::class, 'indexPenagihan'])->name('penagihan');
        Route::get('/penagihan/export', [AdminController::class, 'exportPenagihan'])->name('penagihan.export');
        Route::patch('/penagihan/{paket}/status', [AdminController::class, 'updateStatusBayar'])->name('penagihan.status');

        Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
        Route::post('/settings/mapel', [AdminController::class, 'storeMapel'])->name('mapel.store');
        Route::patch('/settings/mapel/{mapel}', [AdminController::class, 'updateMapel'])->name('mapel.update');
        Route::delete('/settings/mapel/{mapel}', [AdminController::class, 'destroyMapel'])->name('mapel.destroy');
        Route::post('/settings/kurikulum', [AdminController::class, 'storeKurikulum'])->name('kurikulum.store');
        Route::patch('/settings/kurikulum/{kurikulum}', [AdminController::class, 'updateKurikulum'])->name('kurikulum.update');
        Route::delete('/settings/kurikulum/{kurikulum}', [AdminController::class, 'destroyKurikulum'])->name('kurikulum.destroy');
        Route::patch('/tutor/{tutor}/mapel', [AdminController::class, 'syncTutorMapel'])->name('tutor.mapel.sync');
        Route::get('/help', [AdminController::class, 'help'])->name('help');
    });

    Route::prefix('tutor')->middleware('tutor')->name('tutor.')->group(function () {
        Route::get('/', [TutorController::class, 'dashboard'])->name('dashboard');
        Route::get('/riwayat', [TutorController::class, 'riwayat'])->name('riwayat');
        Route::get('/help', [TutorController::class, 'help'])->name('help');
        Route::post('/presensi/mulai', [TutorController::class, 'mulai'])->name('presensi.mulai');
        Route::post('/presensi/{presensi}/selesai', [TutorController::class, 'selesai'])->name('presensi.selesai');
    });
});

require __DIR__.'/auth.php';
