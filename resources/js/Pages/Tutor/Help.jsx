import { Card, PageHeader } from '@/Components/ui';
import AppLayout from '@/Layouts/AppLayout';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

const tabs = [
    {
        label: 'Alur Harian',
        color: 'blue',
        items: [
            'Buka Dashboard — lihat apakah ada presensi aktif (sesi yang sedang berjalan).',
            'Jika belum mulai: klik "Mulai Mengajar" → pilih siswa → klik "Mulai".',
            'Sesi berjalan — siapkan materi dan evaluasi saat mengajar.',
            'Setelah selesai mengajar: klik "Selesaikan Sesi" → isi materi & evaluasi → submit.',
            'Sesi tercatat otomatis, durasi dihitung dari mulai hingga selesai.',
            'Sisa sesi siswa berkurang 1 otomatis setiap sesi selesai.',
        ],
    },
    {
        label: 'Mulai Presensi',
        color: 'green',
        items: [
            'Klik tombol "Mulai Mengajar" di dashboard.',
            'Pilih siswa dari dropdown — hanya siswa yang diampu kamu yang muncul.',
            'Klik "Mulai" — presensi aktif langsung tercatat dengan waktu sekarang.',
            'Hanya bisa ada satu presensi aktif dalam satu waktu — selesaikan dulu sebelum mulai yang baru.',
            'Jika salah pilih siswa, hubungi admin untuk koreksi data.',
        ],
    },
    {
        label: 'Selesaikan Presensi',
        color: 'indigo',
        items: [
            'Di dashboard, kartu presensi aktif tampil dengan tombol "Selesaikan Sesi".',
            'Klik tombol tersebut → form pengisian muncul.',
            'Isi kolom Materi: topik yang diajarkan hari ini.',
            'Isi kolom Evaluasi: perkembangan siswa, catatan, atau hal yang perlu diperhatikan.',
            'Klik "Selesai" — waktu selesai dicatat, fee dihitung otomatis.',
            'Setelah selesai, kamu tidak bisa mengubah data presensi — hubungi admin jika ada koreksi.',
        ],
    },
    {
        label: 'Daftar Siswa',
        color: 'amber',
        items: [
            'Tabel siswa diampu tampil di bawah kartu presensi di dashboard.',
            'Kolom Sisa Sesi: hijau = cukup, merah = ≤ 3 sesi (perlu topup).',
            'Kolom Terakhir Diajar: relatif dari hari ini (contoh: "3 hari lalu").',
            'Jika sisa sesi merah, infokan ke admin agar segera topup paket.',
            'Data siswa hanya bisa diubah oleh admin.',
        ],
    },
    {
        label: 'Riwayat Mengajar',
        color: 'teal',
        items: [
            'Buka menu "Riwayat Mengajar" di sidebar.',
            'Semua sesi yang sudah selesai tampil dengan tanggal, waktu, siswa, dan durasi.',
            'Kolom Fee: honorarium yang kamu terima per sesi.',
            'Total fee bulan ini tampil di bagian atas halaman.',
            'Data riwayat tidak bisa diedit dari halaman ini — hubungi admin untuk koreksi.',
        ],
    },
    {
        label: 'Catatan Penting',
        color: 'rose',
        items: [
            'Satu presensi aktif per waktu — tidak bisa mulai dua sesi sekaligus.',
            'Presensi yang sudah selesai tidak bisa dibatalkan sendiri — hubungi admin.',
            'Sisa sesi 0 → kamu tetap bisa mulai presensi, tapi admin harus topup paket.',
            'Notifikasi sisa sesi dikirim ke orang tua/wali — bukan kamu yang kirim WA, itu tugas admin.',
            'Jika ada masalah teknis (error, data salah), segera hubungi admin.',
        ],
    },
];

const colorMap = {
    blue:   { tab: 'bg-blue-600 text-white',    badge: 'bg-blue-50 border-blue-200 text-blue-700',       num: 'bg-blue-100 text-blue-600' },
    indigo: { tab: 'bg-indigo-600 text-white',  badge: 'bg-indigo-50 border-indigo-200 text-indigo-700', num: 'bg-indigo-100 text-indigo-600' },
    green:  { tab: 'bg-emerald-600 text-white', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', num: 'bg-emerald-100 text-emerald-600' },
    amber:  { tab: 'bg-amber-500 text-white',   badge: 'bg-amber-50 border-amber-200 text-amber-700',    num: 'bg-amber-100 text-amber-600' },
    rose:   { tab: 'bg-rose-600 text-white',    badge: 'bg-rose-50 border-rose-200 text-rose-700',       num: 'bg-rose-100 text-rose-600' },
    teal:   { tab: 'bg-teal-600 text-white',    badge: 'bg-teal-50 border-teal-200 text-teal-700',       num: 'bg-teal-100 text-teal-600' },
};

export default function Help() {
    const [active, setActive] = useState(0);
    const tab = tabs[active];
    const c = colorMap[tab.color];

    return (
        <AppLayout>
            <PageHeader icon={HelpCircle} title="Panduan Tutor" eyebrow="Bantuan & Tutorial" />

            <div className="mb-6 flex flex-wrap gap-2">
                {tabs.map((t, i) => (
                    <button
                        key={t.label}
                        onClick={() => setActive(i)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                            active === i
                                ? colorMap[t.color].tab
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <Card>
                <div className={`mb-4 inline-block rounded-lg border px-3 py-1 text-xs font-semibold ${c.badge}`}>
                    {tab.label}
                </div>
                <ol className="space-y-3">
                    {tab.items.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-600">
                            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${c.num}`}>
                                {i + 1}
                            </span>
                            {item}
                        </li>
                    ))}
                </ol>
            </Card>
        </AppLayout>
    );
}
