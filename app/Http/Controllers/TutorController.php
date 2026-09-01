<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\Siswa;
use App\Services\PresensiService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TutorController extends Controller
{
    public function __construct(private PresensiService $presensiService) {}

    public function dashboard(): Response
    {
        $tutor = auth()->user();
        $aktif = $tutor->presensi()->whereNull('selesai')->with('siswa:id,nama,mata_pelajaran')->first();

        return Inertia::render('Tutor/Dashboard', [
            'presensiAktif' => $aktif?->load('siswa:id,nama,mata_pelajaran,kelas'),
            'siswaDiampu' => Siswa::where('tutor_id', $tutor->id)
                ->withSum('paketSesi as sisa_sesi', 'sisa_sesi')
                ->withMax('presensi as last_presensi', 'mulai')
                ->orderBy('nama')->get(['id', 'nama', 'mata_pelajaran', 'kelas']),
            'feeTotal' => $tutor->presensi()
                ->whereNotNull('selesai')
                ->with('fee')
                ->get()
                ->sum(fn ($p) => $p->fee?->jumlah ?? 0),
            'presensiCount' => $tutor->presensi()->whereNotNull('selesai')->count(),
        ]);
    }

    public function riwayat(): Response
    {
        $presensi = auth()->user()->presensi()
            ->with(['siswa:id,nama,mata_pelajaran', 'fee'])
            ->whereNotNull('selesai')
            ->orderByDesc('mulai')
            ->paginate(15);

        return Inertia::render('Tutor/Riwayat', [
            'presensi' => $presensi,
            'stats' => [
                'total_fee' => auth()->user()->presensi()
                    ->whereNotNull('selesai')->with('fee')->get()
                    ->sum(fn ($p) => $p->fee?->jumlah ?? 0),
                'total_sesi' => auth()->user()->presensi()->whereNotNull('selesai')->count(),
                'total_durasi' => auth()->user()->presensi()
                    ->whereNotNull('selesai')->sum('durasi_menit'),
                'siswa_diajar' => auth()->user()->presensi()
                    ->whereNotNull('selesai')->distinct()->count('siswa_id'),
            ],
        ]);
    }

    public function help(): Response
    {
        return Inertia::render('Tutor/Help');
    }

    public function mulai(Request $request)
    {
        $data = $request->validate([
            'siswa_id' => ['required', 'exists:siswa,id'],
        ]);

        try {
            $this->presensiService->mulai(auth()->user(), $data['siswa_id']);

            return back()->with('success', 'Presensi dimulai.');
        } catch (\DomainException $e) {
            return back()->withErrors(['presensi' => $e->getMessage()]);
        }
    }

    public function selesai(Request $request, Presensi $presensi)
    {
        abort_unless($presensi->user_id === auth()->id(), 403);

        $data = $request->validate([
            'materi' => ['nullable', 'string'],
            'evaluasi' => ['nullable', 'string'],
        ]);

        try {
            $this->presensiService->selesai($presensi, $data['materi'] ?? null, $data['evaluasi'] ?? null);

            return back()->with('success', 'Presensi selesai. Fee & sisa sesi diperbarui.');
        } catch (\DomainException $e) {
            return back()->withErrors(['presensi' => $e->getMessage()]);
        }
    }
}
