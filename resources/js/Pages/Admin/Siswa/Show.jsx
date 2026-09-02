import { Badge, Button, Card, Field, inputClass, Table } from '@/Components/ui';
import Modal from '@/Components/Modal';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    GraduationCap,
    Phone,
    Plus,
    Trash2,
    UserRound,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

export default function SiswaShow({ siswa, tutors, paket }) {
    const [paketOpen, setPaketOpen] = useState(false);
    const [topUpOpen, setTopUpOpen] = useState(null);

    const paketForm = useForm({ siswa_id: siswa.id, jumlah_sesi: '' });
    const topUpForm = useForm({ tambah_sesi: '' });
    const tutorForm = useForm({ tutor_id: siswa.tutor_id ?? '' });

    const totalSisa = paket
        .filter((p) => !p.deleted_at)
        .reduce((acc, p) => acc + p.sisa_sesi, 0);

    function tambahPaket(e) {
        e.preventDefault();
        paketForm.post(route('admin.paket.store'), {
            onSuccess: () => setPaketOpen(false),
        });
    }

    function topUp(e, paketId) {
        e.preventDefault();
        topUpForm.post(route('admin.paket.topup', paketId), {
            onSuccess: () => setTopUpOpen(null),
        });
    }

    function assignTutor(e) {
        e.preventDefault();
        tutorForm.patch(route('admin.siswa.tutor', siswa.id));
    }

    return (
        <AppLayout>
            <Link
                href={route('admin.siswa.index')}
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-700"
            >
                <ArrowLeft className="h-4 w-4" /> Kembali ke daftar siswa
            </Link>

            <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
                <div className="pointer-events-none absolute -bottom-12 right-32 h-32 w-32 rounded-full bg-amber-400/20 blur-2xl" />
                <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-2xl font-extrabold text-white shadow-lg">
                            {siswa.nama?.[0] ?? '?'}
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-widest text-white/70">
                                Detail Siswa
                            </div>
                            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">
                                {siswa.nama}
                            </h1>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge tone="white">{siswa.mata_pelajaran}</Badge>
                                {siswa.kelas && (
                                    <Badge tone="white">{siswa.kelas}</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => { paketForm.reset(); setPaketOpen(true); }} variant="yellow">
                        <Plus className="h-4 w-4" /> Tambah Paket
                    </Button>
                </div>
            </div>

            <form
                onSubmit={assignTutor}
                className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft"
            >
                {!siswa.tutor_id && (
                    <div className="w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                        Siswa belum memiliki tutor pengampu — tutor tidak bisa memulai presensi untuk siswa ini.
                    </div>
                )}
                <div className="min-w-52 flex-1">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                        Tutor Pengampu
                    </label>
                    <select
                        className={inputClass}
                        value={tutorForm.data.tutor_id}
                        onChange={(e) =>
                            tutorForm.setData('tutor_id', e.target.value)
                        }
                    >
                        <option value="">-- Belum ada tutor --</option>
                        {tutors.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" disabled={tutorForm.processing}>
                    Simpan Tutor
                </Button>
            </form>

            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <InfoCard
                    icon={UserRound}
                    label="Orang Tua / Wali"
                    value={siswa.nama_orang_tua ?? '-'}
                />
                <InfoCard
                    icon={Phone}
                    label="Nomor WA Orang Tua"
                    value={siswa.nomor_wa_orang_tua ?? siswa.nomor_wa ?? '-'}
                    highlight
                />
                <InfoCard
                    icon={Wallet}
                    label="Total Sisa Sesi"
                    value={`${totalSisa} sesi`}
                    accent
                />
            </div>

            <Card>
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">
                            Paket Sesi
                        </h3>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Riwayat paket & sisa sesi siswa
                        </p>
                    </div>
                </div>

                <Table
                    head={['Tanggal', 'Total Sesi', 'Sisa', 'Status', 'Aksi']}
                    empty="Belum ada paket sesi."
                >
                    {paket.map((p) => (
                        <tr key={p.id} className="transition hover:bg-slate-50/70">
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {p.tanggal_mulai}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                                {p.jumlah_sesi}
                            </td>
                            <td className="px-6 py-4">
                                <Badge tone="blue">
                                    {p.sisa_sesi} tersisa
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                {p.deleted_at ? (
                                    <Badge tone="red">Dihapus</Badge>
                                ) : p.sisa_sesi > 0 ? (
                                    <Badge tone="green">Aktif</Badge>
                                ) : (
                                    <Badge tone="yellow">Habis</Badge>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {!p.deleted_at && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="secondary"
                                            className="px-3 py-1.5 text-xs"
                                            onClick={() => {
                                                topUpForm.reset();
                                                setTopUpOpen(p.id);
                                            }}
                                        >
                                            Top-up
                                        </Button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Hapus paket sesi ini?')) {
                                                    router.delete(route('admin.paket.destroy', p.id));
                                                }
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" /> Hapus
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>

            <Modal show={paketOpen} onClose={() => setPaketOpen(false)}>
                <form onSubmit={tambahPaket} className="p-6">
                    <h2 className="mb-1 text-xl font-bold text-slate-800">
                        Tambah Paket Sesi
                    </h2>
                    <p className="mb-6 text-sm text-slate-500">
                        Buat paket baru untuk {siswa.nama}.
                    </p>
                    <Field label="Jumlah Sesi" required>
                        <input
                            type="number"
                            min="1"
                            required
                            className={inputClass}
                            value={paketForm.data.jumlah_sesi}
                            onChange={(e) =>
                                paketForm.setData(
                                    'jumlah_sesi',
                                    e.target.value,
                                )
                            }
                        />
                    </Field>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setPaketOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={paketForm.processing}>
                            Tambah Paket
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal show={topUpOpen !== null} onClose={() => setTopUpOpen(null)}>
                {topUpOpen !== null && (
                    <form onSubmit={(e) => topUp(e, topUpOpen)} className="p-6">
                        <h2 className="mb-1 text-xl font-bold text-slate-800">
                            Top-up Sesi
                        </h2>
                        <p className="mb-6 text-sm text-slate-500">
                            Tambah sisa sesi pada paket yang dipilih.
                        </p>
                        <Field label="Tambah Sesi" required>
                            <input
                                type="number"
                                min="1"
                                required
                                className={inputClass}
                                value={topUpForm.data.tambah_sesi}
                                onChange={(e) =>
                                    topUpForm.setData(
                                        'tambah_sesi',
                                        e.target.value,
                                    )
                                }
                            />
                        </Field>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setTopUpOpen(null)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={topUpForm.processing}>
                                Top-up
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </AppLayout>
    );
}

function InfoCard({ icon: Icon, label, value, highlight, accent }) {
    const styles = {
        accent: 'from-amber-400 to-orange-500',
        highlight: 'from-blue-500 to-indigo-600',
        default: 'from-slate-600 to-slate-800',
    };
    const bg = accent ? styles.accent : highlight ? styles.highlight : styles.default;

    return (
        <div className="overflow-hidden rounded-2xl border border-white/80 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${bg} text-white shadow-md`}
                >
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {label}
                    </div>
                    <div className="mt-0.5 font-bold text-slate-800">{value}</div>
                </div>
            </div>
        </div>
    );
}
