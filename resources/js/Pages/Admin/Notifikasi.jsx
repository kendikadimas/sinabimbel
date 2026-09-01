import { Badge, Card, PageHeader, PageTip, Table } from '@/Components/ui';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router, useForm } from '@inertiajs/react';
import { Bell, CircleCheck, Clock, MessageCircle, Phone } from 'lucide-react';

export default function Notifikasi({ notifikasi }) {
    const terkirim = notifikasi.data.filter((n) => n.status === 'terkirim').length;
    const belum = notifikasi.data.length - terkirim;

    return (
        <AppLayout>
            <PageHeader
                icon={Bell}
                title="Notifikasi WhatsApp"
                desc="Reminder sisa sesi ke orang tua. Klik Hubungi WA untuk kirim, lalu tandai terkirim."
                eyebrow="Monitoring"
                gradient="from-emerald-600 via-green-600 to-teal-600"
            />

            <div className="mb-8 grid grid-cols-3 gap-5">
                <MiniStat icon={MessageCircle} label="Total" value={notifikasi.total} tone="blue" />
                <MiniStat icon={CircleCheck} label="Terkirim" value={terkirim} tone="green" />
                <MiniStat icon={Clock} label="Belum Dikirim" value={belum} tone={belum > 0 ? 'red' : 'green'} />
            </div>

            <Card padding={false}>
                <div className="border-b border-slate-100 px-6 py-5">
                    <h3 className="text-base font-bold text-slate-800">Riwayat Pengiriman</h3>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Halaman {notifikasi.current_page} dari {notifikasi.last_page}
                    </p>
                </div>
                <Table
                    head={['Waktu Trigger', 'Siswa', 'Nomor Tujuan', 'Sisa Sesi', 'Status', 'Aksi']}
                    empty="Belum ada notifikasi."
                >
                    {notifikasi.data.map((n) => (
                        <tr key={n.id} className="transition hover:bg-slate-50/70">
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {n.created_at
                                    ? new Date(n.created_at).toLocaleString('id-ID')
                                    : '-'}
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-800">
                                {n.siswa?.nama ?? '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{n.nomor_tujuan}</td>
                            <td className="px-6 py-4">
                                <Badge tone="yellow">{n.sisa_sesi_saat_kirim} sesi</Badge>
                            </td>
                            <td className="px-6 py-4">
                                {n.status === 'terkirim' ? (
                                    <Badge tone="green">
                                        <CircleCheck className="h-3.5 w-3.5" /> Terkirim{' '}
                                        {n.dikirim_pada
                                            ? new Date(n.dikirim_pada).toLocaleString('id-ID')
                                            : ''}
                                    </Badge>
                                ) : (
                                    <Badge tone="red">
                                        <Clock className="h-3.5 w-3.5" /> Belum Dikirim
                                    </Badge>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {n.status !== 'terkirim' && (
                                    <ActionButtons notif={n} />
                                )}
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>

            {notifikasi.last_page > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {Array.from({ length: notifikasi.last_page }, (_, i) => i + 1).map((p) => (
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

            <PageTip title="Tips Notifikasi WA" tips={[
                'Notifikasi muncul otomatis saat sisa sesi siswa ≤ 3 setelah presensi selesai.',
                'Klik "Hubungi WA" — browser buka wa.me, ketik pesan, kirim secara manual.',
                'Setelah kirim, kembali ke halaman ini dan klik "Tandai Terkirim".',
                'Notifikasi tidak dibuat saat buat paket baru atau topup — hanya saat presensi selesai.',
            ]} />
        </AppLayout>
    );
}

function ActionButtons({ notif }) {
    const form = useForm({});

    // Format nomor ke 62xxx (tanpa + atau leading 0)
    const nomor = notif.nomor_tujuan
        ? notif.nomor_tujuan.replace(/^0/, '62').replace(/\D/g, '')
        : '';
    const waUrl = `https://wa.me/${nomor}?text=${encodeURIComponent(notif.isi_pesan)}`;

    function markSent() {
        form.post(route('admin.notifikasi.sent', notif.id));
    }

    return (
        <div className="flex items-center gap-2">
            <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
                <Phone className="h-3.5 w-3.5" />
                Hubungi WA
            </a>
            <button
                onClick={markSent}
                disabled={form.processing}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
                <CircleCheck className="h-3.5 w-3.5" />
                Tandai Terkirim
            </button>
        </div>
    );
}

function MiniStat({ icon: Icon, label, value, tone }) {
    const tones = {
        blue: 'from-blue-500 to-indigo-600',
        green: 'from-emerald-500 to-teal-600',
        red: 'from-rose-500 to-red-600',
    };

    return (
        <div className={`flex items-center gap-4 rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg ${tones[tone]}`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <div className="text-2xl font-extrabold text-white">{value}</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/70">{label}</div>
            </div>
        </div>
    );
}
