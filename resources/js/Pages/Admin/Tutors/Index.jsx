import { Badge, Button, Card, Field, inputClass, PageHeader, StatCard, Table } from '@/Components/ui';
import Modal from '@/Components/Modal';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import { AlertTriangle, Pencil, Plus, UserRound, Users, Wallet } from 'lucide-react';
import { useState } from 'react';

export default function TutorsIndex({ tutors, stats }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const form = useForm({
        name: '',
        email: '',
        password: '',
        nomor_wa: '',
        nominal_per_jam: '',
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
            nominal_per_jam: t.rate_per_jam ?? '',
        });
        setModalOpen(true);
    }

    function submit(e) {
        e.preventDefault();
        if (editing) {
            form.patch(route('admin.tutor.update', editing.id), {
                onSuccess: () => setModalOpen(false),
            });
        } else {
            form.post(route('admin.tutor.store'), {
                onSuccess: () => setModalOpen(false),
            });
        }
    }

    return (
        <AppLayout>
            <PageHeader
                icon={Users}
                title="Kelola Tutor"
                desc="Tambah akun, atur rate fee per jam, dan reset password."
                action={
                    <Button onClick={openCreate}>
                        <Plus className="h-4 w-4" /> Tambah Tutor
                    </Button>
                }
            />

            <div className="mb-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
                <StatCard
                    icon={Users}
                    label="Total Tutor"
                    value={stats.total}
                    tone="blue"
                />
                <StatCard
                    icon={AlertTriangle}
                    label="Tanpa Rate"
                    value={stats.tanpa_rate}
                    tone={stats.tanpa_rate > 0 ? 'orange' : 'green'}
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
                <Table
                    head={['Tutor', 'Kontak', 'Rate Fee / Jam', 'Status', 'Aksi']}
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
                                {t.rate_per_jam ? (
                                    <Badge tone="blue">
                                        Rp{' '}
                                        {Number(t.rate_per_jam).toLocaleString(
                                            'id-ID',
                                        )}
                                        /jam
                                    </Badge>
                                ) : (
                                    <Badge tone="yellow">Belum diatur</Badge>
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
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Nomor WA">
                                <input
                                    className={inputClass}
                                    value={form.data.nomor_wa}
                                    onChange={(e) =>
                                        form.setData(
                                            'nomor_wa',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                            <Field label="Rate per Jam (Rp)">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className={inputClass}
                                    value={form.data.nominal_per_jam}
                                    onChange={(e) =>
                                        form.setData(
                                            'nominal_per_jam',
                                            e.target.value,
                                        )
                                    }
                                />
                            </Field>
                        </div>
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
        </AppLayout>
    );
}

