import { Badge, Button, Card, Field, inputClass, PageHeader, StatCard } from '@/Components/ui';
import Modal from '@/Components/Modal';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import {
    CalendarDays,
    Clock,
    GraduationCap,
    Play,
    Sparkles,
    Timer,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

export default function Dashboard({
    presensiAktif,
    siswaDiampu,
    feeTotal,
    presensiCount,
}) {
    const [mulaiOpen, setMulaiOpen] = useState(false);
    const mulaiForm = useForm({ siswa_id: '' });
    const selesaiForm = useForm({ materi: '', evaluasi: '' });

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    function mulaiPresensi(e) {
        e.preventDefault();
        mulaiForm.post(route('tutor.presensi.mulai'), {
            onSuccess: () => setMulaiOpen(false),
        });
    }

    function selesaikanPresensi(e) {
        e.preventDefault();
        selesaiForm.post(
            route('tutor.presensi.selesai', presensiAktif.id),
        );
    }

    return (
        <AppLayout>
            <PageHeader
                icon={Sparkles}
                title="Halo, selamat mengajar"
                eyebrow={today}
                gradient="from-emerald-600 via-teal-600 to-emerald-700"
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <StatCard
                    icon={Wallet}
                    label="Total Fee"
                    value={`Rp ${Number(feeTotal).toLocaleString('id-ID')}`}
                    tone="yellow"
                    hint="Akumulasi semua sesi"
                />
                <StatCard
                    icon={Timer}
                    label="Total Presensi"
                    value={presensiCount}
                    tone="teal"
                    hint="Sesi selesai"
                />
                <StatCard
                    icon={GraduationCap}
                    label="Siswa Diampu"
                    value={siswaDiampu.length}
                    tone="indigo"
                    hint="Siswa yang pernah diajar"
                />
            </div>

            <div className="mt-8">
                {presensiAktif ? (
                    <Card className="border-2 border-rose-200 bg-gradient-to-br from-white to-rose-100/60 shadow-xl">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                                    <span className="absolute right-2 top-2 h-2.5 w-2.5 animate-ping rounded-full bg-rose-600" />
                                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-600" />
                                    <Clock className="h-7 w-7" />
                                </div>
                                <div>
                                    <Badge tone="red">Sedang Berjalan</Badge>
                                    <div className="mt-2 flex items-center gap-2 font-bold text-slate-800">
                                        {presensiAktif.siswa.nama}
                                        <Badge tone="blue">
                                            {presensiAktif.siswa.mata_pelajaran}
                                        </Badge>
                                    </div>
                                    <div className="mt-1 text-sm text-slate-500">
                                        Mulai{' '}
                                        {new Date(
                                            presensiAktif.mulai,
                                        ).toLocaleTimeString('id-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={selesaikanPresensi}
                            className="mt-6 space-y-4"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Materi">
                                    <textarea
                                        rows={3}
                                        className={inputClass}
                                        placeholder="Contoh: Present Continuous Tense"
                                        value={selesaiForm.data.materi}
                                        onChange={(e) =>
                                            selesaiForm.setData(
                                                'materi',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>
                                <Field label="Evaluasi">
                                    <textarea
                                        rows={3}
                                        className={inputClass}
                                        placeholder="Catatan perkembangan siswa..."
                                        value={selesaiForm.data.evaluasi}
                                        onChange={(e) =>
                                            selesaiForm.setData(
                                                'evaluasi',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </Field>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    variant="danger"
                                    disabled={selesaiForm.processing}
                                >
                                    <Clock className="h-4 w-4" />
                                    Selesaikan Presensi
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : (
                    <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500 text-white">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-blue-600/40 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-10 right-20 h-32 w-32 rounded-full bg-amber-100 blur-3xl" />
                        <div className="relative flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-slate-800">
                                    <Play className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">
                                        Belum ada sesi berjalan
                                    </h3>
                                    <p className="mt-1 text-sm text-white/60">
                                        Mulai presensi sebelum mengajar — waktu
                                        mulai & selesai dihitung otomatis.
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="yellow"
                                onClick={() => {
                                    mulaiForm.reset();
                                    setMulaiOpen(true);
                                }}
                            >
                                <Play className="h-4 w-4" /> Mulai Mengajar
                            </Button>
                        </div>
                    </Card>
                )}
            </div>

            <Modal show={mulaiOpen} onClose={() => setMulaiOpen(false)}>
                <form onSubmit={mulaiPresensi} className="p-6">
                    <div className="mb-1 flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-blue-700" />
                        <h2 className="text-xl font-bold text-slate-800">
                            Mulai Presensi
                        </h2>
                    </div>
                    <p className="mb-6 text-sm text-slate-500">
                        Pilih siswa yang akan diajar.
                    </p>
                    <Field label="Pilih Siswa" required>
                        <select
                            required
                            className={inputClass}
                            value={mulaiForm.data.siswa_id}
                            onChange={(e) =>
                                mulaiForm.setData('siswa_id', e.target.value)
                            }
                        >
                            <option value="">-- Pilih siswa --</option>
                            {siswaDiampu.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.nama} ({s.mata_pelajaran})
                                </option>
                            ))}
                        </select>
                    </Field>
                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setMulaiOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={mulaiForm.processing}>
                            <Play className="h-4 w-4" /> Mulai
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
