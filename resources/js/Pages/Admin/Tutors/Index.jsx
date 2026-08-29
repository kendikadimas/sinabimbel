import { Badge, Button, Card, Field, inputClass, PageHeader, StatCard, Table } from '@/Components/ui';
import Modal from '@/Components/Modal';
import AppLayout from '@/Layouts/AppLayout';
import { router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Tags, Trash2, UserRound, Users, Wallet } from 'lucide-react';
import { useState } from 'react';

export default function TutorsIndex({ tutors, stats, rateKelas, mataPelajaran }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [rateModal, setRateModal] = useState(false);
    const [editingRate, setEditingRate] = useState(null);

    const form = useForm({
        name: '',
        email: '',
        password: '',
        nomor_wa: '',
        mata_pelajaran: [],
    });

    const rateForm = useForm({
        kelas: '',
        nominal_per_sesi: '',
    });


    function openCreate() {
        setEditing(null);
        form.reset();
        setModalOpen(true);
    }

    function openEdit(t) {
        setEditing(t);
        form.setData({
            name: t.name,
            email: t.email,
            password: '',
            nomor_wa: t.nomor_wa ?? '',
            mata_pelajaran: t.mata_pelajaran ?? [],
        });
        setModalOpen(true);
    }

    function submit(e) {
        e.preventDefault();
        if (editing) {
            form.patch(route('admin.tutor.update', editing.id), {
                onSuccess: () => {
                    router.patch(
                        route('admin.tutor.mapel.sync', editing.id),
                        { mata_pelajaran: form.data.mata_pelajaran },
                        { onSuccess: () => setModalOpen(false) },
                    );
                },
            });
        } else {
            form.post(route('admin.tutor.store'), {
                onSuccess: () => setModalOpen(false),
            });
        }
    }

    function openRateCreate() {
        setEditingRate(null);
        rateForm.reset();
        setRateModal(true);
    }

    function openRateEdit(r) {
        setEditingRate(r);
        rateForm.setData({
            kelas: r.kelas,
            nominal_per_sesi: r.nominal_per_sesi,
        });
        setRateModal(true);
    }

    function submitRate(e) {
        e.preventDefault();
        if (editingRate) {
            rateForm.patch(route('admin.rate-kelas.update', editingRate.id), {
                onSuccess: () => setRateModal(false),
            });
        } else {
            rateForm.post(route('admin.rate-kelas.store'), {
                onSuccess: () => setRateModal(false),
            });
        }
    }

    function destroyRate(r) {
        if (confirm(`Hapus rate fee untuk kelas ${r.kelas}?`)) {
            rateForm.delete(route('admin.rate-kelas.destroy', r.id));
        }
    }

    return (
        <AppLayout>
            <PageHeader
                icon={Users}
                title="Kelola Tutor"
                desc="Tambah akun, atur password, dan reset akun tutor."
                eyebrow="Manajemen"
                action={
                    <Button onClick={openCreate}>
                        <Plus className="h-4 w-4" /> Tambah Tutor
                    </Button>
                }
            />

            <div className="mb-6 grid grid-cols-2 gap-5 lg:grid-cols-3">
                <StatCard
                    icon={Users}
                    label="Total Tutor"
                    value={stats.total}
                    tone="blue"
                />
                <StatCard
                    icon={UserRound}
                    label="Total Sesi"
                    value={stats.total_presensi}
                    tone="teal"
                />
                <StatCard
                    icon={Wallet}
                    label="Total Fee"
                    value={'Rp ' + Number(stats.total_fee).toLocaleString('id-ID')}
                    tone="yellow"
                />
            </div>

            <Card padding={false}>
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">
                            Daftar Tutor
                        </h3>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Akun login tutor
                        </p>
                    </div>
                </div>
                <Table
                    head={['Tutor', 'Mapel', 'Kontak', 'Status', 'Aksi']}
                    empty="Belum ada tutor."
                >
                    {tutors.map((t) => (
                        <tr key={t.id} className="transition hover:bg-slate-50/70">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                                        {t.name
                                            .split(' ')
                                            .map((w) => w[0])
                                            .slice(0, 2)
                                            .join('')
                                            .toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800">
                                            {t.name}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {t.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                    {t.mata_pelajaran && t.mata_pelajaran.length > 0
                                        ? mataPelajaran
                                            .filter((m) => t.mata_pelajaran.includes(m.id))
                                            .map((m) => <Badge key={m.id} tone="blue">{m.nama}</Badge>)
                                        : <span className="text-slate-300 text-sm">-</span>
                                    }
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {t.nomor_wa ? (
                                    <span className="flex items-center gap-1.5">
                                        <UserRound className="h-4 w-4 text-slate-400" />
                                        {t.nomor_wa}
                                    </span>
                                ) : (
                                    <span className="text-slate-300">-</span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <Badge tone="green">Aktif</Badge>
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => openEdit(t)}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                >
                                    <Pencil className="h-4 w-4" /> Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>

            <Card className="mt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">
                            Rate Fee per Kelas
                        </h3>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Fee tutor dihitung berdasarkan kelas siswa, bukan per
                            tutor.
                        </p>
                    </div>
                    <Button onClick={openRateCreate}>
                        <Plus className="h-4 w-4" /> Tambah Rate
                    </Button>
                </div>

                {rateKelas.length === 0 ? (
                    <p className="mt-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-10 text-center text-sm text-slate-400">
                        Belum ada rate kelas. Tambahkan untuk tiap kelas siswa.
                    </p>
                ) : (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {rateKelas.map((r) => (
                            <div
                                key={r.id}
                                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-soft"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                        <Tags className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">
                                            {r.kelas}
                                        </div>
                                        <div className="text-sm font-semibold text-blue-700">
                                            Rp{' '}
                                            {Number(
                                                r.nominal_per_sesi,
                                            ).toLocaleString('id-ID')}
                                            /sesi
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => openRateEdit(r)}
                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-700"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => destroyRate(r)}
                                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="mb-1 text-xl font-bold text-slate-800">
                        {editing ? 'Edit Tutor' : 'Tambah Tutor'}
                    </h2>
                    <p className="mb-6 text-sm text-slate-500">
                        {editing
                            ? 'Perbarui informasi akun tutor.'
                            : 'Buat akun baru untuk tutor.'}
                    </p>

                    <div className="space-y-4">
                        <Field label="Nama" required>
                            <input
                                className={inputClass}
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Email" required>
                            <input
                                type="email"
                                className={inputClass}
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label={
                                editing
                                    ? 'Password (kosongkan jika tidak diganti)'
                                    : 'Password'
                            }
                            required={!editing}
                        >
                            <input
                                type="password"
                                className={inputClass}
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Nomor WA">
                            <input
                                className={inputClass}
                                value={form.data.nomor_wa}
                                onChange={(e) =>
                                    form.setData('nomor_wa', e.target.value)
                                }
                            />
                        </Field>
                        {editing && mataPelajaran.length > 0 && (
                            <Field label="Mata Pelajaran Diampu">
                                <div className="grid grid-cols-2 gap-2">
                                    {mataPelajaran.map((m) => (
                                        <label key={m.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                                checked={form.data.mata_pelajaran.includes(m.id)}
                                                onChange={(e) => {
                                                    const ids = form.data.mata_pelajaran;
                                                    form.setData('mata_pelajaran', e.target.checked
                                                        ? [...ids, m.id]
                                                        : ids.filter((id) => id !== m.id));
                                                }}
                                            />
                                            <span className="text-sm font-medium text-slate-700">{m.nama}</span>
                                        </label>
                                    ))}
                                </div>
                            </Field>
                        )}
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
                            {editing ? 'Simpan Perubahan' : 'Tambah Tutor'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal show={rateModal} onClose={() => setRateModal(false)}>
                <form onSubmit={submitRate} className="p-6">
                    <h2 className="mb-1 text-xl font-bold text-slate-800">
                        {editingRate ? 'Edit Rate Kelas' : 'Tambah Rate Kelas'}
                    </h2>
                    <p className="mb-6 text-sm text-slate-500">
                        Fee per jam untuk kelas ini.
                    </p>
                    <div className="space-y-4">
                        <Field label="Kelas" required>
                            <input
                                className={inputClass}
                                placeholder="mis. 8 SMP / Dewasa"
                                value={rateForm.data.kelas}
                                onChange={(e) =>
                                    rateForm.setData('kelas', e.target.value)
                                }
                            />
                        </Field>
                        <Field label="Rate per Sesi (Rp)" required>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className={inputClass}
                                value={rateForm.data.nominal_per_sesi}
                                onChange={(e) =>
                                    rateForm.setData(
                                        'nominal_per_sesi',
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
                            onClick={() => setRateModal(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={rateForm.processing}>
                            {editingRate ? 'Simpan' : 'Tambah'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
