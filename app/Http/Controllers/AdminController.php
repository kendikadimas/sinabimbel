<?php

namespace App\Http\Controllers;

use App\Enums\NotifStatus;
use App\Models\ActivityLog;
use App\Models\Fee;
use App\Models\Kurikulum;
use App\Models\MataPelajaran;
use App\Models\NotifikasiWa;
use App\Models\PaketSesi;
use App\Models\Presensi;
use App\Models\RateKelas;
use App\Models\Siswa;
use App\Models\User;
use App\Services\ExportService;
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
            'riwayatHariIni' => Presensi::with(['user:id,name', 'siswa:id,nama'])
                ->whereNotNull('selesai')->whereDate('mulai', today())
                ->latest('selesai')->get(),
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
                ->with('mataPelajaran:id,nama')
                ->orderBy('name')
                ->get()
                ->map(fn ($t) => [
                    'id' => $t->id,
                    'name' => $t->name,
                    'email' => $t->email,
                    'nomor_wa' => $t->nomor_wa,
                    'mata_pelajaran' => $t->mataPelajaran->pluck('id'),
                ]),
            'stats' => [
                'total' => User::where('role', 'tutor')->count(),
                'total_presensi' => Presensi::whereNotNull('selesai')->count(),
                'total_fee' => Fee::sum('jumlah'),
            ],
            'rateKelas' => RateKelas::orderBy('kelas')->get(),
            'mataPelajaran' => MataPelajaran::orderBy('nama')->get(['id', 'nama']),
        ]);
    }

    public function storeTutor(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'nomor_wa' => ['nullable', 'string', 'max:20'],
        ]);

        User::create([...$data, 'role' => 'tutor']);

        ActivityLog::record('create', "Tambah tutor: {$data['name']}", 'Tutor');

        return back()->with('success', 'Tutor berhasil ditambahkan.');
    }

    public function updateTutor(Request $request, User $tutor)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$tutor->id],
            'password' => ['nullable', 'string', 'min:8'],
            'nomor_wa' => ['nullable', 'string', 'max:20'],
        ]);

        $tutor->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'nomor_wa' => $data['nomor_wa'] ?? null,
            'password' => ! empty($data['password']) ? Hash::make($data['password']) : $tutor->password,
        ]);

        ActivityLog::record('update', "Update tutor: {$tutor->name}", 'Tutor', $tutor->id);

        return back()->with('success', 'Tutor berhasil diperbarui.');
    }

    public function destroyTutor(User $tutor)
    {
        $tutor->delete();

        ActivityLog::record('delete', "Hapus tutor: {$tutor->name}", 'Tutor', $tutor->id);

        return back()->with('success', 'Tutor berhasil dihapus.');
    }

    // ---- Rate fee per kelas ----

    public function storeRateKelas(Request $request)
    {
        $data = $request->validate([
            'kelas' => ['required', 'string', 'max:50', 'unique:rate_kelas,kelas'],
            'nominal_per_sesi' => ['required', 'numeric', 'min:0'],
        ]);

        RateKelas::create($data);

        return back()->with('success', 'Rate fee kelas ditambahkan.');
    }

    public function updateRateKelas(Request $request, RateKelas $rateKelas)
    {
        $data = $request->validate([
            'kelas' => ['required', 'string', 'max:50', 'unique:rate_kelas,kelas,'.$rateKelas->id],
            'nominal_per_sesi' => ['required', 'numeric', 'min:0'],
        ]);

        $rateKelas->update($data);

        return back()->with('success', 'Rate fee kelas diperbarui.');
    }

    public function destroyRateKelas(RateKelas $rateKelas)
    {
        $rateKelas->delete();

        return back()->with('success', 'Rate fee kelas dihapus.');
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
            'rateKelas' => RateKelas::orderBy('kelas')->get(['id', 'kelas']),
            'mataPelajaran' => MataPelajaran::orderBy('nama')->get(['id', 'nama']),
            'kurikulum' => Kurikulum::orderBy('nama')->get(['id', 'nama']),
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
            'nomor_wa' => ['nullable', 'string', 'max:20'],
            'nama_orang_tua' => ['nullable', 'string', 'max:255'],
            'nomor_wa_orang_tua' => ['nullable', 'string', 'max:20'],
            'kurikulum' => ['nullable', 'string', 'max:100'],
            'jumlah_sesi' => ['nullable', 'integer', 'min:1'],
        ]);

        $jumlahSesi = $data['jumlah_sesi'] ?? null;
        unset($data['jumlah_sesi']);

        $siswa = Siswa::create($data);

        ActivityLog::record('create', "Tambah siswa: {$siswa->nama}", 'Siswa', $siswa->id);

        if ($jumlahSesi) {
            PaketSesi::create([
                'siswa_id' => $siswa->id,
                'jumlah_sesi' => $jumlahSesi,
                'sisa_sesi' => $jumlahSesi,
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
            'nomor_wa' => ['nullable', 'string', 'max:20'],
            'nama_orang_tua' => ['nullable', 'string', 'max:255'],
            'nomor_wa_orang_tua' => ['nullable', 'string', 'max:20'],
            'kurikulum' => ['nullable', 'string', 'max:100'],
        ]);

        $siswa->update($data);

        ActivityLog::record('update', "Update siswa: {$siswa->nama}", 'Siswa', $siswa->id);

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
        $siswa->load(['paketSesi' => fn ($q) => $q->withoutGlobalScopes()->with('notifikasi'), 'tutor']);

        return Inertia::render('Admin/Siswa/Show', [
            'siswa' => $siswa,
            'tutors' => User::where('role', 'tutor')->orderBy('name')->get(['id', 'name']),
            'paket' => $siswa->paketSesi->map(fn ($p) => [
                'id' => $p->id,
                'jumlah_sesi' => $p->jumlah_sesi,
                'sisa_sesi' => $p->sisa_sesi,
                'tanggal_mulai' => $p->tanggal_mulai ? \Carbon\Carbon::parse($p->tanggal_mulai)->format('d M Y') : null,
                'deleted_at' => $p->deleted_at?->format('d M Y'),
            ]),
        ]);
    }

    public function destroySiswa(Siswa $siswa)
    {
        $siswa->delete();

        ActivityLog::record('delete', "Hapus siswa: {$siswa->nama}", 'Siswa', $siswa->id);

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

        ActivityLog::record('delete', "Hapus paket sesi ID {$paket->id} (siswa ID {$paket->siswa_id})", 'PaketSesi', $paket->id);

        return back()->with('success', 'Paket dihapus.');
    }

    // ---- Rekap ----

    public function rekap(Request $request): Response
    {
        $dari = $request->date('dari') ?? today()->startOfMonth();
        $sampai = $request->date('sampai') ?? today();

        $presensi = Presensi::query()
            ->whereNotNull('selesai')
            ->with(['user:id,name', 'siswa:id,nama,kelas,mata_pelajaran,nomor_grup', 'fee'])
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
            ->with(['user:id,name', 'siswa:id,nama,kelas,mata_pelajaran,nomor_grup,nomor_wa,nama_orang_tua,nomor_wa_orang_tua,kurikulum', 'fee'])
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
                ->latest()
                ->paginate(15),
        ]);
    }

    public function markNotifikasiSent(NotifikasiWa $notif)
    {
        $notif->update([
            'status'      => NotifStatus::Terkirim,
            'dikirim_pada' => now(),
        ]);

        ActivityLog::record('sent', "Tandai terkirim notifikasi WA ID {$notif->id}", 'NotifikasiWa', $notif->id);

        return back()->with('success', 'Notifikasi ditandai terkirim.');
    }

    public function destroyNotifikasi(NotifikasiWa $notif)
    {
        $notif->delete();

        ActivityLog::record('delete', "Hapus notifikasi WA ID {$notif->id}", 'NotifikasiWa', $notif->id);

        return back()->with('success', 'Notifikasi dihapus.');
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

        // Hitung ulang fee — pakai snapshot rate dari fee yang ada, fallback ke
        // rate kelas siswa saat ini, agar koreksi tidak mengubah nilai historis.
        $feeRow = $presensi->fee;
        $rate = $feeRow?->rate_per_sesi ?? $presensi->siswa->rateKelas?->nominal_per_sesi;
        if ($rate !== null) {
            Fee::updateOrCreate(
                ['presensi_id' => $presensi->id],
                [
                    'jumlah' => $rate,
                    'rate_per_sesi' => $rate,
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

    // ---- Settings (master data) ----

    public function settings(): Response
    {
        return Inertia::render('Admin/Settings/Index', [
            'mataPelajaran' => MataPelajaran::orderBy('nama')->get(),
            'kurikulum' => Kurikulum::orderBy('nama')->get(),
            'rateKelas' => RateKelas::orderBy('kelas')->get(),
        ]);
    }

    public function help(): Response
    {
        return Inertia::render('Admin/Help');
    }

    public function storeMapel(Request $request)
    {
        $data = $request->validate(['nama' => ['required', 'string', 'max:100', 'unique:mata_pelajaran,nama']]);
        MataPelajaran::create($data);

        return back()->with('success', 'Mata pelajaran ditambahkan.');
    }

    public function updateMapel(Request $request, MataPelajaran $mapel)
    {
        $data = $request->validate(['nama' => ['required', 'string', 'max:100', 'unique:mata_pelajaran,nama,'.$mapel->id]]);
        $mapel->update($data);

        return back()->with('success', 'Mata pelajaran diperbarui.');
    }

    public function destroyMapel(MataPelajaran $mapel)
    {
        $mapel->delete();

        return back()->with('success', 'Mata pelajaran dihapus.');
    }

    public function storeKurikulum(Request $request)
    {
        $data = $request->validate(['nama' => ['required', 'string', 'max:100', 'unique:kurikulum,nama']]);
        Kurikulum::create($data);

        return back()->with('success', 'Kurikulum ditambahkan.');
    }

    public function updateKurikulum(Request $request, Kurikulum $kurikulum)
    {
        $data = $request->validate(['nama' => ['required', 'string', 'max:100', 'unique:kurikulum,nama,'.$kurikulum->id]]);
        $kurikulum->update($data);

        return back()->with('success', 'Kurikulum diperbarui.');
    }

    public function destroyKurikulum(Kurikulum $kurikulum)
    {
        $kurikulum->delete();

        return back()->with('success', 'Kurikulum dihapus.');
    }

    // ---- Tutor assign mata pelajaran ----

    public function syncTutorMapel(Request $request, User $tutor)
    {
        $data = $request->validate(['mata_pelajaran' => ['nullable', 'array'], 'mata_pelajaran.*' => ['exists:mata_pelajaran,id']]);
        $tutor->mataPelajaran()->sync($data['mata_pelajaran'] ?? []);

        return back()->with('success', 'Mata pelajaran tutor diperbarui.');
    }

    // ---- Activity Log ----

    public function activityLog(): Response
    {
        return Inertia::render('Admin/ActivityLog', [
            'logs' => ActivityLog::with('user:id,name')
                ->latest()
                ->paginate(25),
        ]);
    }
}
