import { Card, PageHeader } from '@/Components/ui';
import AppLayout from '@/Layouts/AppLayout';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

const tabs = [
    {
        label: 'Setup Awal',
        color: 'violet',
        items: [
            'Buka menu Settings di sidebar.',
            'Tambah Mata Pelajaran: klik "Tambah" → isi nama → simpan. Ulangi untuk semua mapel yang tersedia.',
            'Tambah Kurikulum: sama seperti mapel — isi semua kurikulum yang dipakai (contoh: K13, Merdeka).',
            'Atur Rate Kelas: klik "Tambah Rate" → pilih jenjang (SD/SMP/SMA/UTBK/dst) → isi nominal per sesi → simpan.',
            'Rate kelas menjadi nilai default saat admin membuat paket sesi baru — set sebelum mulai daftarkan siswa.',
            'Setelah settings selesai, lanjut ke langkah berikutnya: daftarkan tutor.',
        ],
    },
    {
        label: 'Alur Bisnis',
        color: 'blue',
        items: [
            'Setup Settings dulu (mapel, kurikulum, rate kelas) sebelum langkah lain.',
            'Daftarkan tutor → buat akun tutor di menu Tutor.',
            'Daftarkan siswa → isi data siswa + mata pelajaran di menu Siswa & Paket.',
            'Assign tutor ke siswa → buka detail siswa → klik "Ganti Tutor".',
            'Buat paket sesi → di detail siswa → klik "Tambah Paket" → isi jumlah sesi & tanggal mulai.',
            'Tutor mengajar → tutor login → mulai presensi → isi materi & evaluasi → selesaikan.',
            'Sisa sesi berkurang otomatis setiap presensi selesai.',
            'Jika sisa sesi ≤ 3 → notifikasi WA muncul di menu Notifikasi WA.',
            'Admin kirim WA manual → klik "Hubungi WA" → kirim pesan → klik "Tandai Terkirim".',
            'Topup paket → di detail siswa → klik "Topup" pada paket yang aktif.',
            'Tagihan otomatis terbuat saat presensi selesai → cek menu Penagihan.',
            'Ubah status bayar → di Penagihan → klik "Tandai Lunas" per paket.',
            'Rekap & penggajian → menu Rekap & Penggajian → filter tutor/tanggal → export CSV.',
        ],
    },
    {
        label: 'Tutor',
        color: 'indigo',
        items: [
            'Tambah tutor: menu Tutor → klik "Tambah Tutor" → isi nama, email, password.',
            'Edit tutor: klik ikon pensil pada baris tutor → ubah nama atau email.',
            'Ganti password: klik ikon kunci → isi password baru.',
            'Hapus tutor: klik ikon tong sampah → konfirmasi. Tutor yang punya riwayat presensi tetap tersimpan (soft delete).',
            'Assign mata pelajaran: klik ikon buku pada tutor → pilih mata pelajaran yang dikuasai.',
        ],
    },
    {
        label: 'Siswa & Paket',
        color: 'green',
        items: [
            'Tambah siswa: menu Siswa & Paket → klik "Tambah Siswa" → isi nama, kelas, mata pelajaran, kurikulum.',
            'Edit siswa: buka detail siswa → klik "Edit" → ubah data.',
            'Assign tutor ke siswa: detail siswa → "Ganti Tutor" → pilih tutor.',
            'Tambah paket sesi: detail siswa → "Tambah Paket" → isi jumlah sesi, nominal per sesi, tanggal mulai.',
            'Topup paket: detail siswa → tombol "Topup" di kartu paket → isi jumlah sesi tambahan.',
            'Hapus paket: hanya bisa dihapus jika belum ada presensi di paket tersebut.',
            'Hapus siswa: soft delete — data presensi & fee tetap tersimpan.',
        ],
    },
    {
        label: 'Presensi & Rekap',
        color: 'amber',
        items: [
            'Presensi dibuat oleh tutor saat mengajar — admin tidak bisa membuat presensi baru.',
            'Edit presensi: menu Rekap & Penggajian → klik ikon pensil pada baris presensi → ubah materi, evaluasi, atau waktu.',
            'Filter rekap: pilih tutor, rentang tanggal, lalu klik "Filter".',
            'Export: klik "Export CSV" — mengunduh rekap sesuai filter aktif.',
            'Fee dihitung otomatis berdasarkan rate kelas saat presensi selesai.',
        ],
    },
    {
        label: 'Penagihan',
        color: 'rose',
        items: [
            'Tagihan muncul otomatis per paket sesi saat ada presensi yang selesai.',
            'Status awal: Belum Bayar.',
            'Ubah ke Lunas: klik "Tandai Lunas" → konfirmasi.',
            'Filter penagihan: pilih status bayar atau rentang tanggal.',
            'Export: klik "Export CSV" untuk unduh data penagihan.',
        ],
    },
    {
        label: 'Notifikasi WA',
        color: 'teal',
        items: [
            'Notifikasi otomatis muncul saat sisa sesi siswa ≤ 3 setelah presensi selesai.',
            'Status awal: Belum Dikirim (merah).',
            'Kirim WA: klik "Hubungi WA" → browser buka wa.me → ketik & kirim pesan secara manual.',
            'Setelah kirim: kembali ke halaman → klik "Tandai Terkirim" → status berubah hijau.',
            'Notifikasi tidak dibuat saat buat paket atau topup — hanya saat presensi selesai.',
        ],
    },
    {
        label: 'Settings',
        color: 'purple',
        items: [
            'Mata Pelajaran: tambah/edit/hapus mata pelajaran yang tersedia di dropdown siswa.',
            'Kurikulum: tambah/edit/hapus kurikulum yang tersedia di dropdown siswa.',
            'Rate Kelas: atur nominal per sesi per jenjang kelas (SD, SMP, SMA, UTBK, dst).',
            'Rate kelas digunakan sebagai nilai default saat membuat paket sesi baru.',
            'Perubahan rate kelas tidak mempengaruhi paket yang sudah ada.',
        ],
    },
];

const colorMap = {
    violet: { tab: 'bg-violet-600 text-white', badge: 'bg-violet-50 border-violet-200 text-violet-700', num: 'bg-violet-100 text-violet-600' },
    blue:   { tab: 'bg-blue-600 text-white',   badge: 'bg-blue-50 border-blue-200 text-blue-700',     num: 'bg-blue-100 text-blue-600' },
    indigo: { tab: 'bg-indigo-600 text-white', badge: 'bg-indigo-50 border-indigo-200 text-indigo-700', num: 'bg-indigo-100 text-indigo-600' },
    green:  { tab: 'bg-emerald-600 text-white', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', num: 'bg-emerald-100 text-emerald-600' },
    amber:  { tab: 'bg-amber-500 text-white',  badge: 'bg-amber-50 border-amber-200 text-amber-700',  num: 'bg-amber-100 text-amber-600' },
    rose:   { tab: 'bg-rose-600 text-white',   badge: 'bg-rose-50 border-rose-200 text-rose-700',     num: 'bg-rose-100 text-rose-600' },
    teal:   { tab: 'bg-teal-600 text-white',   badge: 'bg-teal-50 border-teal-200 text-teal-700',     num: 'bg-teal-100 text-teal-600' },
    purple: { tab: 'bg-purple-600 text-white', badge: 'bg-purple-50 border-purple-200 text-purple-700', num: 'bg-purple-100 text-purple-600' },
};

export default function Help() {
    const [active, setActive] = useState(0);
    const tab = tabs[active];
    const c = colorMap[tab.color];

    return (
        <AppLayout>
            <PageHeader icon={HelpCircle} title="Panduan Admin" eyebrow="Bantuan & Tutorial" />

            {/* Tab bar */}
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

            {/* Content */}
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
