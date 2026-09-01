import { Badge, Button, Card, Field, inputClass, PageHeader, PageTip, StatCard, Table } from '@/Components/ui';
import Modal from '@/Components/Modal';
import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { Clock, Download, FileSpreadsheet, Pencil, Users, Wallet } from 'lucide-react';
import { useState } from 'react';

export default function Rekap({ presensi, rekapFee, dari, sampai, stats }) {
    const filter = useForm({ dari, sampai });
    const [editing, setEditing] = useState(null);

    const editForm = useForm({
        mulai: '',
        selesai: '',
        materi: '',
        evaluasi: '',
    });

    const totalFee = rekapFee.reduce((a, r) => a + Number(r.total_fee), 0);

    function terapkan(e) {
        e.preventDefault();
        window.location.href = route('admin.rekap', {
            dari: filter.data.dari,
            sampai: filter.data.sampai,
        });
    }

    function openEdit(p) {
        editForm.setData({
            mulai: toLocal(p.mulai),
            selesai: toLocal(p.selesai),
            materi: p.materi ?? '',
            evaluasi: p.evaluasi ?? '',
        });
        setEditing(p.id);
    }

    function saveEdit(e) {
        e.preventDefault();
        editForm.patch(route('admin.rekap.presensi.update', editing), {
            onSuccess: () => setEditing(null),
        });
    }

    function toLocal(value) {
        if (!value) return '';
        const d = new Date(value);
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    return (
        <AppLayout>
            <PageHeader
                icon={Wallet}
                title="Rekap Presensi & Fee"
                desc="Pilih periode, lihat rekap fee per tutor, dan export ke Excel."
                eyebrow="Penggajian"
                gradient="from-fuchsia-600 via-pink-600 to-rose-600"
            />

            <Card className="mb-8">
                <form onSubmit={terapkan} className="flex flex-wrap items-end gap-4">
                    <label className="text-sm font-semibold text-slate-800">
                        Dari
                        <input
                            type="date"
                            className={`${inputClass} mt-1.5 w-44`}
                            value={filter.data.dari}
                            onChange={(e) =>
                                filter.setData('dari', e.target.value)
                            }
                        />
                    </label>
                    <label className="text-sm font-semibold text-slate-800">
                        Sampai
                        <input
                            type="date"
                            className={`${inputClass} mt-1.5 w-44`}
                            value={filter.data.sampai}
                            onChange={(e) =>
                                filter.setData('sampai', e.target.value)
                            }
                        />
                    </label>
                    <Button type="submit" variant="secondary">
                        Terapkan Periode
                    </Button>
                    <a
                        href={route('admin.rekap.export', {
                            dari: filter.data.dari,
                            sampai: filter.data.sampai,
                        })}
                        className="ml-auto"
                    >
                        <Button type="button">
                            <Download className="h-4 w-4" /> Export Excel
                        </Button>
                    </a>
                </form>
            </Card>

            <div className="mb-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
                <StatCard
                    icon={Wallet}
                    label="Total Fee"
                    value={'Rp ' + Number(stats.total_fee).toLocaleString('id-ID')}
                    tone="yellow"
                />
                <StatCard
                    icon={FileSpreadsheet}
                    label="Total Sesi"
                    value={stats.total_sesi}
                    tone="green"
                />
                <StatCard
                    icon={Users}
                    label="Tutor Aktif"
                    value={stats.tutor_aktif}
                    tone="blue"
                />
                <StatCard
                    icon={Clock}
                    label="Total Durasi"
                    value={fmtDurasi(stats.durasi_total)}
                    tone="sky"
                />
            </div>

            <div className="mb-8 flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 text-white shadow-lg">
                <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-white/60">
                        Total Fee Periode Ini
                    </div>
                    <div className="mt-1 text-3xl font-extrabold">
                        Rp {totalFee.toLocaleString('id-ID')}
                    </div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-slate-800">
                    <Wallet className="h-7 w-7" />
                </div>
            </div>

            <Card className="mb-8" padding={false}>
                <div className="border-b border-slate-100 px-6 py-5">
                    <h3 className="text-base font-bold text-slate-800">
                        Rekap Fee per Tutor
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Untuk kebutuhan penggajian
                    </p>
                </div>
                <Table
                    head={['Tutor', 'Jumlah Sesi', 'Total Fee']}
                    empty="Belum ada data pada periode ini."
                >
                    {rekapFee.map((r, i) => (
                        <tr key={r.tutor_id} className="transition hover:bg-slate-50/70">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                                        {r.tutor[0]}
                                    </div>
                                    <span className="font-semibold text-slate-800">
                                        {r.tutor}
                                    </span>
                                    {i === 0 && r.total_fee > 0 && (
                                        <Badge tone="yellow">Terbanyak</Badge>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {r.jumlah_sesi} sesi
                            </td>
                            <td className="px-6 py-4">
                                <Badge tone="blue">
                                    Rp{' '}
                                    {Number(r.total_fee).toLocaleString('id-ID')}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>

            <Card padding={false}>
                <div className="border-b border-slate-100 px-6 py-5">
                    <h3 className="text-base font-bold text-slate-800">
                        Detail Presensi
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Data presensi selesai pada periode terpilih
                    </p>
                </div>
                <Table
                    head={[
                        'Tutor',
                        'Siswa',
                        'Tanggal',
                        'Waktu',
                        'Durasi',
                        'Fee',
                        'Aksi',
                    ]}
                    empty="Belum ada data."
                >
                    {presensi.data.map((p) => (
                        <tr key={p.id} className="transition hover:bg-slate-50/70">
                            <td className="px-6 py-4 font-semibold text-slate-800">
                                {p.user.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {p.siswa.nama}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {new Date(p.mulai).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {new Date(p.mulai).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {p.durasi_menit} mnt
                            </td>
                            <td className="px-6 py-4 font-semibold text-blue-700">
                                Rp{' '}
                                {Number(p.fee?.jumlah ?? 0).toLocaleString(
                                    'id-ID',
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => openEdit(p)}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                                >
                                    <Pencil className="h-4 w-4" /> Koreksi
                                </button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>

            {presensi.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {Array.from({ length: presensi.last_page }, (_, i) => i + 1).map(
                        (p) => (
                            <Link
                                key={p}
                                href={route('admin.rekap', {
                                    page: p,
                                    dari: filter.data.dari,
                                    sampai: filter.data.sampai,
                                })}
                                className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition ${
                                    p === presensi.current_page
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {p}
                            </Link>
                        ),
                    )}
                </div>
            )}

            <Modal show={editing !== null} onClose={() => setEditing(null)}>
                <form onSubmit={saveEdit} className="p-6">
                    <h2 className="mb-1 text-xl font-bold text-slate-800">
                        Koreksi Presensi
                    </h2>
                    <p className="mb-6 text-sm text-slate-500">
                        Ubah waktu mulai/selesai — durasi & fee dihitung ulang
                        otomatis.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Mulai" required>
                            <input
                                type="datetime-local"
                                className={inputClass}
                                value={editForm.data.mulai}
                                onChange={(e) =>
                                    editForm.setData('mulai', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Selesai" required>
                            <input
                                type="datetime-local"
                                className={inputClass}
                                value={editForm.data.selesai}
                                onChange={(e) =>
                                    editForm.setData('selesai', e.target.value)
                                }
                            />
                        </Field>
                    </div>
                    <div className="mt-4">
                        <Field label="Materi">
                            <textarea
                                rows={2}
                                className={inputClass}
                                value={editForm.data.materi}
                                onChange={(e) =>
                                    editForm.setData('materi', e.target.value)
                                }
                            />
                        </Field>
                    </div>
                    <div className="mt-4">
                        <Field label="Evaluasi">
                            <textarea
                                rows={3}
                                className={inputClass}
                                value={editForm.data.evaluasi}
                                onChange={(e) =>
                                    editForm.setData('evaluasi', e.target.value)
                                }
                            />
                        </Field>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setEditing(null)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={editForm.processing}>
                            Simpan Koreksi
                        </Button>
                    </div>
                </form>
            </Modal>

            <PageTip title="Tips Rekap & Penggajian" tips={[
                'Filter dulu berdasarkan tutor dan rentang tanggal, baru klik "Terapkan".',
                'Fee dihitung otomatis saat presensi selesai — sesuai rate kelas saat itu.',
                'Koreksi presensi: klik ikon pensil → ubah waktu mulai/selesai, materi, evaluasi.',
                'Export CSV mengunduh data sesuai filter aktif — set filter dulu sebelum export.',
                'Durasi max per sesi 8 jam — presensi lebih dari itu akan dipotong otomatis.',
            ]} />
        </AppLayout>
    );
}

function fmtDurasi(menit) {
    const h = Math.floor(menit / 60);
    const m = menit % 60;
    return h > 0 ? `${h} j ${m} mnt` : `${m} mnt`;
}
