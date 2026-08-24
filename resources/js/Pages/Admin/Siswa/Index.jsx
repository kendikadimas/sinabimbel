import { Badge, Button, Card, Field, inputClass, PageHeader, StatCard, Table } from '@/Components/ui';
import Modal from '@/Components/Modal';
import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { ChevronRight, GraduationCap, Package, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';

export default function SiswaIndex({ siswa, tutors, stats, rateKelas }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [q, setQ] = useState('');

    const form = useForm({
        tutor_id: '',
        nama: '',
        nomor_grup: '',
        kelas: '',
        mata_pelajaran: '',
        tingkat: '',
        nomor_wa: '',
        nama_orang_tua: '',
        nomor_wa_orang_tua: '',
        kurikulum: '',
        jumlah_sesi: '',
    });

    function submit(e) {
        e.preventDefault();
        form.post(route('admin.siswa.store'), {
            onSuccess: () => setModalOpen(false),
        });
    }

    function search(e) {
        e.preventDefault();
        window.location.href = route('admin.siswa.index', { q });
    }

    return (
        <AppLayout>
            <PageHeader
                icon={GraduationCap}
                title="Siswa & Paket Sesi"
                desc="Kelola data siswa dan paket sesi yang dimiliki."
                eyebrow="Management"
                gradient="from-sky-600 via-blue-600 to-indigo-600"
                action={
                    <Button onClick={() => setModalOpen(true)}>
                        <Plus className="h-4 w-4" /> Tambah Siswa
                    </Button>
                }
            />

            <form onSubmit={search} className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                        className={inputClass + ' pl-11'}
                        placeholder="Cari nama siswa..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
            </form>

            <div className="mb-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
                <StatCard
                    icon={Users}
                    label="Total Siswa"
                    value={stats.total}
                    tone="indigo"
                />
                <StatCard
                    icon={GraduationCap}
                    label="Total Sisa Sesi"
                    value={stats.total_sisa}
                    tone="green"
                />
                <StatCard
                    icon={Package}
                    label="Paket Aktif"
                    value={stats.paket_aktif}
                    tone="blue"
                />
                <StatCard
                    icon={Package}
                    label="Paket Habis"
                    value={stats.paket_habis}
                    tone={stats.paket_habis > 0 ? 'orange' : 'green'}
                />
            </div>

            <Card padding={false}>
                <Table
                    head={[
                        'Siswa',
                        'Tutor',
                        'Kelas',
                        'Mapel',
                        'Total Paket',
                        'Sisa Sesi',
                        '',
                    ]}
                >
                    {siswa.data.map((s) => (
                        <tr key={s.id} className="transition hover:bg-slate-50/70">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                                        {s.nama[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800">
                                            {s.nama}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {s.tingkat ?? s.kelas ?? '-'}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                                {s.tutor ? (
                                    <Badge tone="blue">{s.tutor.name}</Badge>
                                ) : (
                                    <span className="text-slate-300">-</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {s.kelas ?? '-'}
                            </td>
                            <td className="px-6 py-4">
                                <Badge tone="navy">
                                    {s.mata_pelajaran}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {s.total_paket ?? 0} sesi
                            </td>
                            <td className="px-6 py-4">
                                {(s.total_sisa ?? 0) > 0 ? (
                                    <Badge tone="green">
                                        {s.total_sisa} sesi tersisa
                                    </Badge>
                                ) : (
                                    <Badge tone="yellow">Habis</Badge>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Link
                                    href={route('admin.siswa.show', s.id)}
                                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                >
                                    Detail
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>

            {siswa.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {Array.from({ length: siswa.last_page }, (_, i) => i + 1).map(
                        (p) => (
                            <Link
                                key={p}
                                href={route('admin.siswa.index', {
                                    page: p,
                                    q,
                                })}
                                className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition ${
                                    p === siswa.current_page
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

            <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="mb-1 text-xl font-bold text-slate-800">
                        Tambah Siswa
                    </h2>
                    <p className="mb-6 text-sm text-slate-500">
                        Lengkapi data siswa. Jumlah sesi awal otomatis membuat
                        paket baru.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Nama" required>
                            <input
                                className={inputClass}
                                value={form.data.nama}
                                onChange={(e) =>
                                    form.setData('nama', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Tutor (diampu)">
                            <select
                                className={inputClass}
                                value={form.data.tutor_id}
                                onChange={(e) =>
                                    form.setData('tutor_id', e.target.value)
                                }
                            >
                                <option value="">-- Pilih tutor --</option>
                                {tutors.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Nomor Grup">
                            <input
                                className={inputClass}
                                value={form.data.nomor_grup}
                                onChange={(e) =>
                                    form.setData('nomor_grup', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Kelas">
                            <select
                                className={inputClass}
                                value={form.data.kelas}
                                onChange={(e) =>
                                    form.setData('kelas', e.target.value)
                                }
                            >
                                <option value="">-- Pilih Kelas --</option>
                                {rateKelas.map((r) => (
                                    <option key={r.id} value={r.kelas}>
                                        {r.kelas}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Mata Pelajaran" required>
                            <input
                                className={inputClass}
                                value={form.data.mata_pelajaran}
                                onChange={(e) =>
                                    form.setData(
                                        'mata_pelajaran',
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Tingkat">
                            <input
                                className={inputClass}
                                placeholder="mis. Adult Beginner"
                                value={form.data.tingkat}
                                onChange={(e) =>
                                    form.setData('tingkat', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Kurikulum (skip adult)">
                            <input
                                className={inputClass}
                                value={form.data.kurikulum}
                                onChange={(e) =>
                                    form.setData('kurikulum', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Nomor WA Siswa">
                            <input
                                className={inputClass}
                                value={form.data.nomor_wa}
                                onChange={(e) =>
                                    form.setData('nomor_wa', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Nama Orang Tua">
                            <input
                                className={inputClass}
                                value={form.data.nama_orang_tua}
                                onChange={(e) =>
                                    form.setData(
                                        'nama_orang_tua',
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Nomor WA Orang Tua (notif)">
                            <input
                                className={inputClass}
                                value={form.data.nomor_wa_orang_tua}
                                onChange={(e) =>
                                    form.setData(
                                        'nomor_wa_orang_tua',
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Jumlah Sesi Awal">
                            <input
                                type="number"
                                min="1"
                                className={inputClass}
                                value={form.data.jumlah_sesi}
                                onChange={(e) =>
                                    form.setData(
                                        'jumlah_sesi',
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            Tambah Siswa
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
