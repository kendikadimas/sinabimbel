import { Badge, Button, Card, Field, inputClass, PageHeader, StatCard, Table } from '@/Components/ui';
import Modal from '@/Components/Modal';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import {
    Clock,
    GraduationCap,
    Play,
    Sparkles,
    Timer,
    Wallet,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard({
    presensiAktif,
    siswaDiampu,
    feeTotal,
    presensiCount,
}) {
    const [mulaiOpen, setMulaiOpen] = useState(false);
    const mulaiForm = useForm({ siswa_id: '' });
    const selesaiForm = useForm({ materi: '', evaluasi: '' });

    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const today = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }) + ', ' + now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    function useElapsed(startStr) {
        const [elapsed, setElapsed] = useState('');
        useEffect(() => {
            if (!startStr) return;
            const tick = () => {
                const s = Math.floor((Date.now() - new Date(startStr)) / 1000);
                const h = String(Math.floor(s / 3600)).padStart(2, '0');
                const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
                const sec = String(s % 60).padStart(2, '0');
                setElapsed(`${h}:${m}:${sec}`);
            };
            tick();
            const t = setInterval(tick, 1000);
            return () => clearInterval(t);
        }, [startStr]);
        return elapsed;
    }

    function formatRelative(dateStr) {
        if (!dateStr) return 'Belum pernah';
        const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
        if (diff === 0) return 'Hari ini';
        if (diff === 1) return 'Kemarin';
        return `${diff} hari lalu`;
    }

    function mulaiPresensi(e) {
        e.preventDefault();
        mulaiForm.post(route('tutor.presensi.mulai'), {
            onSuccess: () => setMulaiOpen(false),
        });
    }

    const elapsed = useElapsed(presensiAktif?.mulai);

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
                                    <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-rose-600">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                                        {elapsed}
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

            {/* Daftar Siswa Diampu */}
            <Card className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            <GraduationCap className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-slate-800">Siswa Diampu</h3>
                    </div>
                </div>
                {siswaDiampu.length === 0 ? (
                    <p className="text-sm text-slate-400">Belum ada siswa yang diampu.</p>
                ) : (
                    <Table head={['Nama', 'Kelas', 'Mata Pelajaran', 'Sisa Sesi', 'Terakhir Diajar']}>
                        {siswaDiampu.map((s) => (
                            <tr key={s.id} className="transition hover:bg-slate-50/70">
                                <td className="px-6 py-3 font-medium text-slate-800">{s.nama}</td>
                                <td className="px-6 py-3 text-slate-500">{s.kelas ?? '-'}</td>
                                <td className="px-6 py-3 text-slate-500">{s.mata_pelajaran}</td>
                                <td className="px-6 py-3">
                                    <Badge tone={s.sisa_sesi <= 3 ? 'red' : 'green'}>
                                        {s.sisa_sesi ?? 0} sesi
                                    </Badge>
                                </td>
                                <td className="px-6 py-3 text-sm text-slate-400">
                                    {s.last_presensi ? formatRelative(s.last_presensi) : 'Belum pernah'}
                                </td>
                            </tr>
                        ))}
                    </Table>
                )}
            </Card>

            <Modal show={mulaiOpen} onClose={() => setMulaiOpen(false)} title="Mulai Presensi">
                <form onSubmit={mulaiPresensi}>
                    <p className="mb-4 text-sm text-slate-500">Pilih siswa yang akan diajar.</p>
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
                        <Button type="button" variant="secondary" onClick={() => setMulaiOpen(false)}>
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
