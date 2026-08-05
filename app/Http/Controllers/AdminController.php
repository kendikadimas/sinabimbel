<?php

namespace App\Http\Controllers;

use App\Models\Fee;
use App\Models\NotifikasiWa;
use App\Models\PaketSesi;
use App\Models\Presensi;
use App\Models\RateTutor;
use App\Models\Siswa;
use App\Models\User;
use App\Services\ExportService;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'tutor' => User::where('role', 'tutor')->count(),
                'siswa' => Siswa::count(),
                'paket_aktif' => PaketSesi::where('sisa_sesi', '>', 0)->count(),
                'presensi_hari_ini' => Presensi::whereNotNull('selesai')->whereDate('mulai', today())->count(),
                'notifikasi_gagal' => NotifikasiWa::where('status', 'gagal')->count(),
                'belum_bayar' => PaketSesi::where('status_bayar', 'belum_bayar')->count(),
            ],
            'presensiAktif' => Presensi::with(['user:id,name', 'siswa:id,nama'])
                ->whereNull('selesai')->latest('mulai')->get(),
            'tren' => [
                'presensi7' => collect(range(6, 0))->map(fn ($i) => [
                    'tanggal' => today()->subDays($i)->format('D'),
                    'jumlah' => Presensi::whereNotNull('selesai')
                        ->whereDate('mulai', today()->subDays($i))
                        ->count(),
                ]),
                'feeTutor' => Fee::query()
                    ->join('presensi', 'presensi.id', '=', 'fee.presensi_id')
                    ->join('users', 'users.id', '=', 'presensi.user_id')
                    ->selectRaw('users.name, SUM(fee.jumlah) as total')
                    ->groupBy('users.name')
                    ->orderByDesc('total')
                    ->limit(5)
                    ->get(),
            ],
        ]);
    }

    // ---- Tutor ----

    public function indexTutor(): Response
    {
        return Inertia::render('Admin/Tutors/Index', [
            'tutors' => User::where('role', 'tutor')
                ->with('rate:id,user_id,nominal_per_jam')
                ->orderBy('name')
                ->get()
                ->map(fn ($t) => [
                    'id' => $t->id,
                    'name' => $t->name,
                    'email' => $t->email,
                    'nomor_wa' => $t->nomor_wa,
                    'rate_per_jam' => $t->rate?->nominal_per_jam,
                ]),
            'stats' => [
                'total' => User::where('role', 'tutor')->count(),
                'tanpa_rate' => User::where('role', 'tutor')
                    ->whereDoesntHave('rate')->count(),
                'total_presensi' => Presensi::whereNotNull('selesai')->count(),
                'total_fee' => Fee::sum('jumlah'),
            ],
        ]);
    }

    public function storeTutor(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'nomor_wa' => ['nullable', 'string', 'max:20'],
            'nominal_per_jam' => ['nullable', 'numeric', 'min:0'],
        ]);

        $tutor = User::create([
            ...collect($data)->except('nominal_per_jam')->toArray(),
            'role' => 'tutor',
        ]);

        if (! empty($data['nominal_per_jam'])) {
            RateTutor::create(['user_id' => $tutor->id, 'nominal_per_jam' => $data['nominal_per_jam']]);
        }

        return back()->with('success', 'Tutor berhasil ditambahkan.');
    }

    public function updateTutor(Request $request, User $tutor)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$tutor->id],
            'password' => ['nullable', 'string', 'min:8'],
            'nomor_wa' => ['nullable', 'string', 'max:20'],
            'nominal_per_jam' => ['nullable', 'numeric', 'min:0'],
        ]);

        $tutor->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'nomor_wa' => $data['nomor_wa'] ?? null,
            'password' => ! empty($data['password']) ? Hash::make($data['password']) : $tutor->password,
        ]);

        if (isset($data['nominal_per_jam'])) {
            RateTutor::updateOrCreate(
                ['user_id' => $tutor->id],
                ['nominal_per_jam' => $data['nominal_per_jam']]
            );
        }

        return back()->with('success', 'Tutor berhasil diperbarui.');
    }

    public function destroyTutor(User $tutor)
    {
        if ($tutor->presensi()->exists()) {
            return back()->withErrors(['tutor' => 'Tutor memiliki data presensi, tidak dapat dihapus.']);
        }

        $tutor->delete();

        return back()->with('success', 'Tutor berhasil dihapus.');
    }

    // ---- Siswa & paket ----

    public function indexSiswa(Request $request): Response
    {
        $q = $request->string('q');

        return Inertia::render('Admin/Siswa/Index', [
            'siswa' => Siswa::with('tutor:id,name')
                ->withSum('paketSesi as total_paket', 'jumlah_sesi')
                ->withSum('paketSesi as total_sisa', 'sisa_sesi')
                ->when($q->toString(), fn ($qry, $v) => $qry->where('nama', 'like', "%{$v}%"))
                ->orderBy('nama')
                ->paginate(10)
                ->withQueryString(),
            'tutors' => User::where('role', 'tutor')->orderBy('name')->get(['id', 'name']),
            'stats' => [
                'total' => Siswa::count(),
                'total_sisa' => PaketSesi::where('sisa_sesi', '>', 0)->sum('sisa_sesi'),
                'paket_aktif' => PaketSesi::where('sisa_sesi', '>', 0)->count(),
                'paket_habis' => PaketSesi::where('sisa_sesi', 0)->count(),
            ],
        ]);
    }

    public function storeSiswa(Request $request)
    {
        $data = $request->validate([
            'tutor_id' => ['nullable', 'exists:users,id'],
            'nama' => ['required', 'string', 'max:255'],
            'nomor_grup' => ['nullable', 'string', 'max:20'],
            'kelas' => ['nullable', 'string', 'max:50'],
            'mata_pelajaran' => ['required', 'string', 'max:100'],
            'tingkat' => ['nullable', 'string', 'max:100'],
            'nomor_wa' => ['nullable', 'string', 'max:20'],
            'nama_orang_tua' => ['nullable', 'string', 'max:255'],
            'nomor_wa_orang_tua' => ['nullable', 'string', 'max:20'],
            'kurikulum' => ['nullable', 'string', 'max:100'],
            'jumlah_sesi' => ['nullable', 'integer', 'min:1'],
        ]);

        $siswa = Siswa::create($data);

        if (! empty($data['jumlah_sesi'])) {
            PaketSesi::create([
                'siswa_id' => $siswa->id,
                'jumlah_sesi' => $data['jumlah_sesi'],
                'sisa_sesi' => $data['jumlah_sesi'],
                'tanggal_mulai' => today(),
            ]);
        }

        return back()->with('success', 'Siswa berhasil ditambahkan.');
    }

    public function updateSiswa(Request $request, Siswa $siswa)
    {
        $data = $request->validate([
            'tutor_id' => ['nullable', 'exists:users,id'],
            'nama' => ['required', 'string', 'max:255'],
            'nomor_grup' => ['nullable', 'string', 'max:20'],
            'kelas' => ['nullable', 'string', 'max:50'],
            'mata_pelajaran' => ['required', 'string', 'max:100'],
            'tingkat' => ['nullable', 'string', 'max:100'],
            'nomor_wa' => ['nullable', 'string', 'max:20'],
            'nama_orang_tua' => ['nullable', 'string', 'max:255'],
            'nomor_wa_orang_tua' => ['nullable', 'string', 'max:20'],
            'kurikulum' => ['nullable', 'string', 'max:100'],
        ]);

        $siswa->update($data);

        return back()->with('success', 'Siswa berhasil diperbarui.');
    }

    public function assignTutor(Request $request, Siswa $siswa)
    {
        $data = $request->validate([
            'tutor_id' => ['nullable', 'exists:users,id'],
        ]);

        $siswa->update(['tutor_id' => $data['tutor_id']]);

        return back()->with('success', 'Tutor pengampu diperbarui.');
    }

    public function showSiswa(Siswa $siswa): Response
    {
        $siswa->load(['paketSesi' => fn ($q) => $q->withTrashed()->with('notifikasi'), 'tutor']);

        return Inertia::render('Admin/Siswa/Show', [
            'siswa' => $siswa,
            'tutors' => User::where('role', 'tutor')->orderBy('name')->get(['id', 'name']),
            'paket' => $siswa->paketSesi->map(fn ($p) => [
                'id' => $p->id,
                'jumlah_sesi' => $p->jumlah_sesi,
                'sisa_sesi' => $p->sisa_sesi,
                'tanggal_mulai' => $p->tanggal_mulai->format('d M Y'),
                'deleted_at' => $p->deleted_at?->format('d M Y'),
            ]),
        ]);
    }

    public function destroySiswa(Siswa $siswa)
    {
        $siswa->delete();

        return back()->with('success', 'Siswa berhasil dihapus.');
    }

    public function storePaket(Request $request)
    {
        $data = $request->validate([
            'siswa_id' => ['required', 'exists:siswa,id'],
            'jumlah_sesi' => ['required', 'integer', 'min:1'],
        ]);

        PaketSesi::create([
            'siswa_id' => $data['siswa_id'],
            'jumlah_sesi' => $data['jumlah_sesi'],
            'sisa_sesi' => $data['jumlah_sesi'],
            'tanggal_mulai' => today(),
        ]);

        return back()->with('success', 'Paket sesi ditambahkan.');
    }

    public function topUpPaket(Request $request, PaketSesi $paket)
    {
        $data = $request->validate([
            'tambah_sesi' => ['required', 'integer', 'min:1'],
        ]);

        $paket->update([
            'jumlah_sesi' => $paket->jumlah_sesi + $data['tambah_sesi'],
            'sisa_sesi' => $paket->sisa_sesi + $data['tambah_sesi'],
        ]);

        return back()->with('success', 'Paket di-top-up.');
    }

    public function destroyPaket(PaketSesi $paket)
    {
        $paket->delete();

        return back()->with('success', 'Paket dihapus.');
    }

    // ---- Rekap ----

    public function rekap(Request $request): Response
    {
        $dari = $request->date('dari') ?? today()->startOfMonth();
        $sampai = $request->date('sampai') ?? today();

        $presensi = Presensi::query()
            ->whereNotNull('selesai')
            ->with(['user:id,name', 'siswa:id,nama,kelas,mata_pelajaran,tingkat,nomor_grup', 'fee'])
            ->whereBetween('mulai', [$dari->startOfDay(), $sampai->endOfDay()])
            ->orderBy('mulai')
            ->paginate(15)
            ->withQueryString();

        $rekapFee = Fee::query()
            ->join('presensi', 'presensi.id', '=', 'fee.presensi_id')
            ->join('users', 'users.id', '=', 'presensi.user_id')
            ->whereBetween('presensi.mulai', [$dari->startOfDay(), $sampai->endOfDay()])
            ->selectRaw('users.id as tutor_id, users.name as tutor, COUNT(*) as jumlah_sesi, SUM(fee.jumlah) as total_fee')
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total_fee')
            ->get();

        $totalFee = (float) $rekapFee->sum('total_fee');
        $totalSesi = (int) $rekapFee->sum('jumlah_sesi');

        return Inertia::render('Admin/Rekap', [
            'presensi' => $presensi,
            'rekapFee' => $rekapFee,
            'dari' => $dari->format('Y-m-d'),
            'sampai' => $sampai->format('Y-m-d'),
            'stats' => [
                'total_fee' => $totalFee,
                'total_sesi' => $totalSesi,
                'tutor_aktif' => $rekapFee->count(),
                'durasi_total' => Presensi::whereNotNull('selesai')
                    ->whereBetween('mulai', [$dari->startOfDay(), $sampai->endOfDay()])
                    ->sum('durasi_menit'),
            ],
        ]);
    }

    public function exportRekap(Request $request)
    {
        $dari = $request->date('dari') ?? today()->startOfMonth();
        $sampai = $request->date('sampai') ?? today();

        $presensi = Presensi::query()
            ->whereNotNull('selesai')
            ->with(['user:id,name', 'siswa:id,nama,kelas,mata_pelajaran,tingkat,nomor_grup,nomor_wa,nama_orang_tua,nomor_wa_orang_tua,kurikulum', 'fee'])
            ->whereBetween('mulai', [$dari->startOfDay(), $sampai->endOfDay()])
            ->orderBy('mulai')
            ->get();

        return app(ExportService::class)->rekapPresensi($presensi, $dari, $sampai);
    }

    // ---- Monitoring ----

    public function notifikasi(): Response
    {
        return Inertia::render('Admin/Notifikasi', [
            'notifikasi' => NotifikasiWa::with(['siswa:id,nama', 'paketSesi:id,jumlah_sesi'])
                ->latest('dikirim_pada')
                ->paginate(15),
        ]);
    }

    public function retryNotifikasi(Request $request, NotifikasiWa $notif)
    {
        if ($notif->status->value !== 'gagal') {
            return back()->withErrors(['notif' => 'Hanya notifikasi gagal yang bisa dikirim ulang.']);
        }

        app(WhatsAppService::class)->sendNow($notif);

        return back()->with('success', 'Notifikasi dikirim ulang.');
    }

    // ---- Koreksi presensi ----

    public function updatePresensi(Request $request, Presensi $presensi)
    {
        $data = $request->validate([
            'mulai' => ['required', 'date'],
            'selesai' => ['required', 'date', 'after:mulai'],
            'materi' => ['nullable', 'string'],
            'evaluasi' => ['nullable', 'string'],
        ]);

        $mulai = Carbon::parse($data['mulai']);
        $selesai = Carbon::parse($data['selesai']);
        $durasi = max(1, (int) $mulai->diffInMinutes($selesai));

        $presensi->update([
            'mulai' => $mulai,
            'selesai' => $selesai,
            'durasi_menit' => $durasi,
            'materi' => $data['materi'] ?? null,
            'evaluasi' => $data['evaluasi'] ?? null,
        ]);

        // Hitung ulang fee — pakai snapshot rate dari fee yang ada, bukan rate
        // tutor saat ini, agar koreksi tidak mengubah nilai historis.
        $feeRow = $presensi->fee;
        $rate = $feeRow?->rate_per_jam ?? $presensi->user->rate?->nominal_per_jam;
        if ($rate !== null) {
            Fee::updateOrCreate(
                ['presensi_id' => $presensi->id],
                [
                    'jumlah' => round($rate * $durasi / 60, 2),
                    'rate_per_jam' => $rate,
                ],
            );
        }

        return back()->with('success', 'Presensi berhasil dikoreksi.');
    }

    // ---- Penagihan ----

    public function indexPenagihan(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $paket = PaketSesi::query()
            ->with('siswa:id,nama,kelas,mata_pelajaran')
            ->when($status, fn ($q, $s) => $q->where('status_bayar', $s))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Penagihan', [
            'paket' => $paket,
            'filterStatus' => $status,
            'stats' => [
                'belum_bayar' => PaketSesi::where('status_bayar', 'belum_bayar')->count(),
                'lunas' => PaketSesi::where('status_bayar', 'lunas')->count(),
            ],
        ]);
    }

    public function exportPenagihan(Request $request)
    {
        $status = $request->string('status')->toString();

        $paket = PaketSesi::query()
            ->with('siswa:id,nama,kelas,mata_pelajaran')
            ->when($status, fn ($q, $s) => $q->where('status_bayar', $s))
            ->orderByDesc('created_at')
            ->get();

        $csv = fopen('php://temp', 'w');
        fputcsv($csv, ['Siswa', 'Kelas', 'Mata Pelajaran', 'Tanggal Paket', 'Total Sesi', 'Sisa Sesi', 'Status', 'Dibayar Pada']);

        foreach ($paket as $p) {
            fputcsv($csv, [
                $p->siswa->nama,
                $p->siswa->kelas,
                $p->siswa->mata_pelajaran,
                $p->tanggal_mulai->format('d M Y'),
                $p->jumlah_sesi,
                $p->sisa_sesi,
                $p->status_bayar->label(),
                $p->dibayar_pada?->format('d M Y H:i') ?? '-',
            ]);
        }
        rewind($csv);
        $content = stream_get_contents($csv);
        fclose($csv);

        return response()->streamDownload(
            fn () => print ($content),
            'rekap-penagihan-'.today()->format('Ymd').'.csv',
            ['Content-Type' => 'text/csv; charset=UTF-8'],
        );
    }

    public function updateStatusBayar(Request $request, PaketSesi $paket)
    {
        $data = $request->validate([
            'status_bayar' => ['required', 'in:belum_bayar,lunas'],
        ]);

        $paket->update([
            'status_bayar' => $data['status_bayar'],
            'dibayar_pada' => $data['status_bayar'] === 'lunas' ? now() : null,
        ]);

        return back()->with('success', 'Status pembayaran diperbarui.');
    }
}
