import { Card, PageHeader } from '@/Components/ui';
import AppLayout from '@/Layouts/AppLayout';
import { HelpCircle } from 'lucide-react';

const sections = [
    {
        title: 'Alur Bisnis Keseluruhan',
        color: 'blue',
        items: [
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
        title: 'Manajemen Tutor',
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
        title: 'Manajemen Siswa & Paket',
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
        title: 'Presensi & Rekap',
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
        title: 'Penagihan',
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
        title: 'Notifikasi WhatsApp',
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
        title: 'Settings',
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
    blue:   'bg-blue-50 border-blue-200 text-blue-700',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    green:  'bg-emerald-50 border-emerald-200 text-emerald-700',
    amber:  'bg-amber-50 border-amber-200 text-amber-700',
    rose:   'bg-rose-50 border-rose-200 text-rose-700',
    teal:   'bg-teal-50 border-teal-200 text-teal-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
};

export default function Help() {
    return (
        <AppLayout>
            <PageHeader icon={HelpCircle} title="Panduan Admin" eyebrow="Bantuan & Tutorial" />
            <div className="grid gap-5 md:grid-cols-2">
                {sections.map((s) => (
                    <Card key={s.title}>
                        <div className={`mb-3 inline-block rounded-lg border px-3 py-1 text-xs font-semibold ${colorMap[s.color]}`}>
                            {s.title}
                        </div>
                        <ol className="space-y-2">
                            {s.items.map((item, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-600">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                                        {i + 1}
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ol>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}
