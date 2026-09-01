import { Card, PageHeader, StatCard } from '@/Components/ui';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import {
    Bell,
    Clock,
    FileSpreadsheet,
    GraduationCap,
    ReceiptText,
    Sparkles,
    TrendingUp,
    UserRound,
    Users,
    Wallet,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard({ stats, presensiAktif, tren, riwayatHariIni }) {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const waktu = now.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }) + ', ' + now.toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    return (
        <AppLayout>
            <PageHeader
                icon={Sparkles}
                title="Selamat datang kembali"
                eyebrow={waktu}
                action={
                    <span className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-300" />
                        Live
                    </span>
                }
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard
                    icon={Users}
                    label="Tutor"
                    value={stats.tutor}
                    tone="blue"
                    hint="Akun aktif"
                />
                <StatCard
                    icon={GraduationCap}
                    label="Siswa"
                    value={stats.siswa}
                    tone="indigo"
                    hint="Terdaftar"
                />
                <StatCard
                    icon={FileSpreadsheet}
                    label="Paket Aktif"
                    value={stats.paket_aktif}
                    tone="green"
                    hint="Sisa sesi > 0"
                />
                <StatCard
                    icon={Clock}
                    label="Presensi Hari Ini"
                    value={stats.presensi_hari_ini}
                    tone="sky"
                    hint="Selesai hari ini"
                />
                <StatCard
                    icon={Bell}
                    label="Notif Gagal"
                    value={stats.notifikasi_gagal}
                    tone={stats.notifikasi_gagal > 0 ? 'red' : 'green'}
                    hint="WhatsApp"
                />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <h3 className="text-base font-bold text-slate-800">
                        Presensi 7 Hari Terakhir
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Jumlah sesi selesai per hari
                    </p>
                    <div className="mt-6 flex h-48 gap-3">
                        {tren.presensi7.map((d, i) => {
                            const max = Math.max(
                                1,
                                ...tren.presensi7.map((x) => x.jumlah),
                            );
                            const h = Math.round((d.jumlah / max) * 100);
                            return (
                                <div
                                    key={i}
                                    className="flex h-full flex-1 flex-col items-center"
                                >
                                    <div className="text-xs font-bold text-slate-600">
                                        {d.jumlah}
                                    </div>
                                    <div className="mt-1 flex w-full flex-1 items-end">
                                        <div
                                            className={`w-full rounded-t-lg ${
                                                d.jumlah > 0
                                                    ? 'bg-gradient-to-t from-blue-600 to-blue-400'
                                                    : 'bg-slate-100'
                                            }`}
                                            style={{ height: `${h}%` }}
                                            title={`${d.tanggal}: ${d.jumlah} sesi`}
                                        />
                                    </div>
                                    <div className="mt-1 text-[11px] font-semibold uppercase text-slate-400">
                                        {d.tanggal}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                <Card>
                    <h3 className="text-base font-bold text-slate-800">
                        Fee per Tutor
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Total fee akumulasi (5 teratas)
                    </p>
                    <div className="mt-6 space-y-3">
                        {tren.feeTutor.length === 0 && (
                            <p className="text-sm text-slate-400">
                                Belum ada data fee.
                            </p>
                        )}
                        {tren.feeTutor.map((t) => {
                            const max = Math.max(
                                1,
                                ...tren.feeTutor.map((x) => Number(x.total)),
                            );
                            const pct = Math.round(
                                (Number(t.total) / max) * 100,
                            );
                            return (
                                <div key={t.name}>
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span className="font-semibold text-slate-700">
                                            {t.name}
                                        </span>
                                        <span className="font-bold text-blue-700">
                                            Rp{' '}
                                            {Number(t.total).toLocaleString(
                                                'id-ID',
                                            )}
                                        </span>
                                    </div>
                                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-800">
                                Presensi Sedang Berjalan
                            </h3>
                            <p className="mt-0.5 text-sm text-slate-500">
                                Sesi yang sedang aktif saat ini
                            </p>
                        </div>
                        <span className="flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                            LIVE
                        </span>
                    </div>

                    {presensiAktif.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-14 text-center">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <Clock className="h-7 w-7 text-slate-300" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500">
                                Tidak ada sesi berjalan
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Tutor yang mengajar akan muncul di sini.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {presensiAktif.map((p) => (
                                <li
                                    key={p.id}
                                    className="flex items-center justify-between py-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                            {p.user?.name?.[0] ?? '?'}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800">
                                                {p.user?.name ?? '-'}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                mengajar {p.siswa?.nama ?? '-'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-rose-600">
                                            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                                            {(() => {
                                                const s = Math.floor((now - new Date(p.mulai)) / 1000);
                                                const h = String(Math.floor(s / 3600)).padStart(2, '0');
                                                const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
                                                const sec = String(s % 60).padStart(2, '0');
                                                return `${h}:${m}:${sec}`;
                                            })()}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-400">
                                            Mulai {new Date(p.mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                {/* Riwayat Presensi Hari Ini */}
                <Card className="mt-6 lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-800">Riwayat Presensi Hari Ini</h3>
                            <p className="mt-0.5 text-sm text-slate-500">Sesi yang sudah selesai hari ini</p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                            {riwayatHariIni.length} sesi
                        </span>
                    </div>
                    {riwayatHariIni.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-400">Belum ada sesi selesai hari ini.</p>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {riwayatHariIni.map((p) => {
                                const durasi = p.durasi_menit
                                    ? `${Math.floor(p.durasi_menit / 60)}j ${p.durasi_menit % 60}m`
                                    : '-';
                                return (
                                    <li key={p.id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                                                {p.user?.name?.[0] ?? '?'}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-800">{p.user?.name ?? '-'}</div>
                                                <div className="text-xs text-slate-500">mengajar {p.siswa?.nama ?? '-'}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-emerald-600">{durasi}</div>
                                            <div className="text-xs text-slate-400">
                                                {new Date(p.mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                {' — '}
                                                {new Date(p.selesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </Card>

                <Card className="bg-gradient-to-br from-blue-100 to-amber-50 text-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                        <TrendingUp className="h-4 w-4" /> Aksi Cepat
                    </div>
                    <div className="mt-5 space-y-3">
                        <QuickAction
                            href="admin.tutor.index"
                            icon={UserRound}
                            title="Kelola Tutor"
                            desc="Tambah akun & atur rate fee kelas"
                        />
                        <QuickAction
                            href="admin.siswa.index"
                            icon={GraduationCap}
                            title="Siswa & Paket"
                            desc="Kelola siswa & top-up sesi"
                        />
                        <QuickAction
                            href="admin.rekap"
                            icon={Wallet}
                            title="Rekap & Penggajian"
                            desc="Export rekap per periode"
                        />
                        <QuickAction
                            href="admin.penagihan"
                            icon={ReceiptText}
                            title="Penagihan"
                            desc="Kelola status bayar / lunas"
                        />
                        <QuickAction
                            href="admin.notifikasi"
                            icon={Bell}
                            title="Notifikasi WA"
                            desc="Monitoring status kirim"
                        />
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

function QuickAction({ href, icon: Icon, title, desc }) {
    return (
        <Link
            href={route(href)}
            className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
        >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
                <div className="font-bold text-slate-800">{title}</div>
                <div className="truncate text-xs text-slate-400">{desc}</div>
            </div>
        </Link>
    );
}
