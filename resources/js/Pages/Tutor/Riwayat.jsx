import { Badge, Card, PageHeader, StatCard, Table } from '@/Components/ui';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { BookOpen, Clock, GraduationCap, History, Wallet } from 'lucide-react';

export default function Riwayat({ presensi, stats }) {
    const totalFee = presensi.data.reduce(
        (a, p) => a + Number(p.fee?.jumlah ?? 0),
        0,
    );

    return (
        <AppLayout>
            <PageHeader
                icon={History}
                title="Riwayat Mengajar"
                desc="Semua sesi yang pernah Anda selesaikan."
                eyebrow="Aktivitas"
                gradient="from-sky-600 via-cyan-600 to-teal-600"
            />

            <div className="mb-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
                <StatCard
                    icon={Wallet}
                    label="Total Fee"
                    value={'Rp ' + Number(stats.total_fee).toLocaleString('id-ID')}
                    tone="yellow"
                />
                <StatCard
                    icon={BookOpen}
                    label="Total Sesi"
                    value={stats.total_sesi}
                    tone="green"
                />
                <StatCard
                    icon={Clock}
                    label="Total Durasi"
                    value={fmtDurasi(stats.total_durasi)}
                    tone="sky"
                />
                <StatCard
                    icon={GraduationCap}
                    label="Siswa Diajar"
                    value={stats.siswa_diajar}
                    tone="indigo"
                />
            </div>

            <div className="mb-8 flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 text-white shadow-lg">
                <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/60">
                        Fee Halaman Ini
                    </div>
                    <div className="mt-1 text-3xl font-extrabold">
                        Rp {totalFee.toLocaleString('id-ID')}
                    </div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-slate-800">
                    <Wallet className="h-7 w-7" />
                </div>
            </div>

            <Card padding={false}>
                <div className="border-b border-slate-100 px-6 py-5">
                    <h3 className="text-base font-bold text-slate-800">
                        Daftar Sesi
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Presensi yang sudah selesai
                    </p>
                </div>
                <Table
                    head={[
                        'Tanggal',
                        'Waktu',
                        'Siswa',
                        'Durasi',
                        'Materi',
                        'Fee',
                    ]}
                    empty="Belum ada riwayat mengajar."
                >
                    {presensi.data.map((p) => (
                        <tr key={p.id} className="transition hover:bg-slate-50/70">
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {new Date(p.mulai).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {new Date(p.mulai).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}{' '}
                                -{' '}
                                {new Date(p.selesai).toLocaleTimeString(
                                    'id-ID',
                                    { hour: '2-digit', minute: '2-digit' },
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
                                        {p.siswa.nama[0]}
                                    </div>
                                    <span className="font-semibold text-slate-800">
                                        {p.siswa.nama}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Badge tone="navy">
                                    {p.durasi_menit} menit
                                </Badge>
                            </td>
                            <td className="max-w-xs truncate px-6 py-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    {p.materi && (
                                        <BookOpen className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                    )}
                                    <span className="truncate">
                                        {p.materi ?? '-'}
                                    </span>
                                </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-blue-700">
                                Rp{' '}
                                {Number(p.fee?.jumlah ?? 0).toLocaleString(
                                    'id-ID',
                                )}
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>

            {presensi.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {Array.from(
                        { length: presensi.last_page },
                        (_, i) => i + 1,
                    ).map((p) => (
                        <Link
                            key={p}
                            href={route('tutor.riwayat', { page: p })}
                            className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition ${
                                p === presensi.current_page
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                    : 'bg-white text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {p}
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}

function fmtDurasi(menit) {
    const h = Math.floor(menit / 60);
    const m = menit % 60;
    return h > 0 ? `${h} j ${m} mnt` : `${m} mnt`;
}
