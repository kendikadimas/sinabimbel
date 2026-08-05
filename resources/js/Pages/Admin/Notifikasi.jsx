import { Badge, Card, PageHeader, Table } from '@/Components/ui';
import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { Bell, CircleCheck, CircleX, Loader2, MessageCircle, RotateCcw } from 'lucide-react';

export default function Notifikasi({ notifikasi }) {
    const terkirim = notifikasi.data.filter((n) => n.status === 'terkirim').length;
    const diproses = notifikasi.data.filter((n) => n.status === 'diproses').length;
    const gagal = notifikasi.data.length - terkirim - diproses;

    return (
        <AppLayout>
            <PageHeader
                icon={Bell}
                title="Notifikasi WhatsApp"
                desc="Status pengiriman notifikasi sisa sesi ke orang tua siswa."
                eyebrow="Monitoring"
                gradient="from-emerald-600 via-green-600 to-teal-600"
            />

            <div className="mb-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
                <MiniStat
                    icon={MessageCircle}
                    label="Total Pengiriman"
                    value={notifikasi.total}
                    tone="blue"
                />
                <MiniStat
                    icon={CircleCheck}
                    label="Terkirim"
                    value={terkirim}
                    tone="green"
                />
                <MiniStat
                    icon={Loader2}
                    label="Diproses"
                    value={diproses}
                    tone="sky"
                />
                <MiniStat
                    icon={CircleX}
                    label="Gagal"
                    value={gagal}
                    tone={gagal > 0 ? 'red' : 'green'}
                />
            </div>
            <Card padding={false}>
                <div className="border-b border-slate-100 px-6 py-5">
                    <h3 className="text-base font-bold text-slate-800">
                        Riwayat Pengiriman
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Halaman {notifikasi.current_page} dari{' '}
                        {notifikasi.last_page}
                    </p>
                </div>
                <Table
                    head={[
                        'Waktu',
                        'Siswa',
                        'Nomor Tujuan',
                        'Sisa Sesi',
                        'Status',
                        'Aksi',
                    ]}
                    empty="Belum ada notifikasi."
                >
                    {notifikasi.data.map((n) => (
                        <tr key={n.id} className="transition hover:bg-slate-50/70">
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {new Date(
                                    n.dikirim_pada,
                                ).toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-800">
                                {n.siswa.nama}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {n.nomor_tujuan}
                            </td>
                            <td className="px-6 py-4">
                                <Badge tone="yellow">
                                    {n.sisa_sesi_saat_kirim} sesi
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                {n.status === 'terkirim' ? (
                                    <Badge tone="green">
                                        <CircleCheck className="h-3.5 w-3.5" />
                                        Terkirim
                                    </Badge>
                                ) : n.status === 'diproses' ? (
                                    <Badge tone="blue">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Diproses
                                    </Badge>
                                ) : (
                                    <Badge tone="red">
                                        <CircleX className="h-3.5 w-3.5" />
                                        Gagal
                                    </Badge>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {n.status === 'gagal' && (
                                    <RetryButton id={n.id} />
                                )}
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>

            {notifikasi.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {Array.from(
                        { length: notifikasi.last_page },
                        (_, i) => i + 1,
                    ).map((p) => (
                        <Link
                            key={p}
                            href={route('admin.notifikasi', { page: p })}
                            className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition ${
                                p === notifikasi.current_page
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

function RetryButton({ id }) {
    const form = useForm({});

    return (
        <button
            onClick={() => form.post(route('admin.notifikasi.retry', id))}
            disabled={form.processing}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50"
        >
            <RotateCcw className="h-3.5 w-3.5" />
            Kirim Ulang
        </button>
    );
}

function MiniStat({ icon: Icon, label, value, tone }) {
    const tones = {
        blue: 'from-blue-500 to-indigo-600',
        sky: 'from-sky-400 to-cyan-600',
        green: 'from-emerald-500 to-teal-600',
        red: 'from-rose-500 to-red-600',
        purple: 'from-fuchsia-500 to-purple-600',
    };

    return (
        <div
            className={`flex items-center gap-4 rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg ${tones[tone]}`}
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <div className="text-2xl font-extrabold text-white">
                    {value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/70">
                    {label}
                </div>
            </div>
        </div>
    );
}
