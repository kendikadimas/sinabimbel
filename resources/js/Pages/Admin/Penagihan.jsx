import { Badge, Button, Card, inputClass, PageHeader, PageTip, Table } from '@/Components/ui';
import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { CheckCircle2, Download, ReceiptText, XCircle } from 'lucide-react';

export default function Penagihan({ paket, filterStatus, stats }) {
    const filter = useForm({ status: filterStatus });

    function terapkan(e) {
        e.preventDefault();
        window.location.href = route('admin.penagihan', {
            status: filter.data.status,
        });
    }

    return (
        <AppLayout>
            <PageHeader
                icon={ReceiptText}
                title="Penagihan"
                desc="Pantau paket sesi yang belum/lunas dibayar dan tandai status pembayaran."
                eyebrow="Tagihan"
                gradient="from-amber-500 via-orange-500 to-red-500"
            />

            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <StatMini
                    icon={XCircle}
                    label="Belum Bayar"
                    value={stats.belum_bayar}
                    tone="red"
                />
                <StatMini
                    icon={CheckCircle2}
                    label="Lunas"
                    value={stats.lunas}
                    tone="green"
                />
            </div>

            <Card className="mb-8">
                <form onSubmit={terapkan} className="flex flex-wrap items-end gap-4">
                    <label className="text-sm font-semibold text-slate-800">
                        Filter Status
                        <select
                            className={`${inputClass} mt-1.5 w-52`}
                            value={filter.data.status}
                            onChange={(e) =>
                                filter.setData('status', e.target.value)
                            }
                        >
                            <option value="">Semua Status</option>
                            <option value="belum_bayar">Belum Bayar</option>
                            <option value="lunas">Lunas</option>
                        </select>
                    </label>
                    <Button type="submit" variant="secondary">
                        Terapkan
                    </Button>
                    <a
                        href={route('admin.penagihan.export', {
                            status: filter.data.status,
                        })}
                    >
                        <Button type="button">
                            <Download className="h-4 w-4" /> Export CSV
                        </Button>
                    </a>
                </form>
            </Card>

            <Card padding={false}>
                <div className="border-b border-slate-100 px-6 py-5">
                    <h3 className="text-base font-bold text-slate-800">
                        Daftar Paket Sesi
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Halaman ini menampilkan {stats.belum_bayar} belum bayar ·{' '}
                        {stats.lunas} lunas
                    </p>
                </div>
                <Table
                    head={[
                        'Siswa',
                        'Kelas',
                        'Mapel',
                        'Tanggal',
                        'Sisa Sesi',
                        'Status',
                        'Aksi',
                    ]}
                    empty="Belum ada paket sesi."
                >
                    {paket.data.map((p) => (
                        <tr key={p.id} className="transition hover:bg-slate-50/70">
                            <td className="px-6 py-4 font-semibold text-slate-800">
                                {p.siswa.nama}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {p.siswa.kelas ?? '-'}
                            </td>
                            <td className="px-6 py-4">
                                <Badge tone="navy">
                                    {p.siswa.mata_pelajaran}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {new Date(p.created_at).toLocaleDateString(
                                    'id-ID',
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {p.sisa_sesi > 0 ? (
                                    <Badge tone="blue">
                                        {p.sisa_sesi} sesi
                                    </Badge>
                                ) : (
                                    <Badge tone="yellow">Habis</Badge>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {p.status_bayar === 'lunas' ? (
                                    <Badge tone="green">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Lunas
                                    </Badge>
                                ) : (
                                    <Badge tone="red">
                                        <XCircle className="h-3.5 w-3.5" />
                                        Belum Bayar
                                    </Badge>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {p.status_bayar === 'lunas' ? (
                                    <TandaiBelumBayar paket={p} />
                                ) : (
                                    <TandaiLunas paket={p} />
                                )}
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>

            {paket.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {Array.from(
                        { length: paket.last_page },
                        (_, i) => i + 1,
                    ).map((p) => (
                        <Link
                            key={p}
                            href={route('admin.penagihan', {
                                page: p,
                                status: filter.data.status,
                            })}
                            className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition ${
                                p === paket.current_page
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                    : 'bg-white text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {p}
                        </Link>
                    ))}
                </div>
            )}

            <PageTip title="Tips Penagihan" tips={[
                'Tagihan terbuat otomatis saat presensi selesai — tidak perlu input manual.',
                'Klik "Tandai Lunas" untuk mengubah status bayar per paket sesi.',
                'Filter by status untuk fokus ke tagihan yang belum dibayar.',
                'Export CSV untuk kirim laporan ke orang tua atau arsip keuangan.',
            ]} />
        </AppLayout>
    );
}

function TandaiLunas({ paket }) {
    const form = useForm({ status_bayar: 'lunas' });

    return (
        <Button
            variant="secondary"
            className="border border-emerald-200 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50"
            onClick={() => form.patch(route('admin.penagihan.status', paket.id))}
            disabled={form.processing}
        >
            <CheckCircle2 className="h-4 w-4" /> Tandai Lunas
        </Button>
    );
}

function TandaiBelumBayar({ paket }) {
    const form = useForm({ status_bayar: 'belum_bayar' });

    return (
        <Button
            variant="secondary"
            className="border border-rose-200 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50"
            onClick={() =>
                form.patch(route('admin.penagihan.status', paket.id))
            }
            disabled={form.processing}
        >
            <XCircle className="h-4 w-4" /> Tandai Belum Bayar
        </Button>
    );
}

function StatMini({ icon: Icon, label, value, tone }) {
    const tones = {
        red: 'from-rose-500 to-red-600',
        green: 'from-emerald-500 to-teal-600',
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
