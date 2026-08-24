# PRD — Sistem Manajemen Bimbel (sinabimbel)

> Dokumen acuan utama. Setiap perubahan perilaku sistem harus merujuk ke sini agar tidak melenceng dari kebutuhan.

## 1. Ringkasan

Sistem back-office untuk bimbel. Admin mengelola tutor, siswa, paket sesi, dan penggajian. Tutor melakukan presensi mengajar via akunnya sendiri. Sisa sesi siswa dan fee tutor dihitung otomatis oleh backend. Notifikasi WhatsApp dikirim otomatis saat sisa sesi siswa mendekati batas minimum.

## 2. Tujuan & Non-Tujuan

**Tujuan:**
- Menghilangkan pekerjaan manual admin: rekap presensi, hitung fee, pantau sisa sesi siswa.
- Memberi tutor kontrol atas data miliknya sendiri (presensi & fee real-time).

**Non-tujuan (OUT OF SCOOP, tidak dibangun):**
- Dashboard khusus orang tua.
- Dashboard khusus siswa.
- Pembayaran online / payment gateway.

## 3. Pengguna & Role

| Role | Hak akses |
|------|-----------|
| **Admin** | Akses penuh ke semua data dan fitur. |
| **Tutor** | Hanya data miliknya sendiri (siswa yang diajar, presensi, fee). Tidak bisa melihat data tutor lain. |

> **Registrasi publik dinonaktifkan.** Akun tutor dibuat oleh admin (A1), bukan lewat register terbuka.

## 4. Definisi Istilah

- **Sesi**: satu kali pertemuan mengajar (1 pertemuan = 1 sesi).
- **Paket sesi**: sejumlah sesi yang dimiliki siswa (dibeli dari bimbel).
- **Sisa sesi**: jumlah sesi tersisa pada paket siswa.
- **Fee**: honor/komisi tutor atas aktivitas mengajar.
- **Rate fee**: honor tutor flat per sesi, berdasarkan kelas siswa (bukan per tutor, bukan per jam). Semua tutor yang mengajar siswa kelas SMA mendapat fee yang sama.
- **Periode**: rentang tanggal untuk rekap presensi/penggajian (mis. mingguan/bulanan, ditentukan admin saat lihat rekap).

## 5. Fitur Fungsional

### 5.1 Dashboard Admin

- **A1. Kelola akun tutor**: tambah, edit, hapus akun tutor beserta password. Hapus hanya jika tidak ada data terkait (atau soft delete — lihat Asumsi).
- **A2. Kelola data siswa & paket sesi**: CRUD siswa; kelola paket sesi yang dimiliki siswa (tambah sesi, lihat sisa sesi).
- **A3. Mengatur rate fee tutor**: rate per jam per tutor.
- **A4. Rekap presensi tutor per periode**: daftar presensi seluruh tutor dalam rentang tanggal, termasuk durasi mengajar.
- **A5. Rekap total fee otomatis**: jumlah total fee per tutor dalam periode, untuk kebutuhan penggajian.
- **A6. Monitoring status notifikasi WhatsApp**: daftar notifikasi yang dikirim beserta status (terkirim / gagal) dan waktu kirim.
- **A7. Pencatatan penagihan**: daftar paket sesi per siswa dengan status pembayaran (belum bayar / lunas). Admin menandai status bayar; notifikasi WhatsApp hanya pengingat, bukan pencatatan pembayaran.

### 5.2 Dashboard Tutor

- **T1. Login** menggunakan akun masing-masing.
- **T2. Isolasi data**: tutor hanya melihat data miliknya (siswa yang diampu, riwayat presensi, fee).
- **T3. Tombol presensi mulai & selesai mengajar**: tutor menekan "mulai" saat mengajar dimulai dan "selesai" saat berakhir. Tidak bisa presensi ganda aktif bersamaan.
- **T4. Riwayat aktivitas mengajar**: daftar sesi presensi tutor (tanggal, mulai–selesai, siswa).
- **T5. Perhitungan fee otomatis real-time**: fee dihitung dari data presensi dan rate tutor, tampil langsung di dashboard.

### 5.3 Presensi, Sisa Sesi & Fee

- Sisa sesi siswa berkurang **1** setiap kali presensi tutor selesai (diproses backend, bukan frontend).
- Fee dihitung otomatis oleh backend berdasarkan data presensi + rate tutor.
- Presensi tidak bisa diedit oleh tutor setelah selesai (koreksi hanya oleh admin).
- Admin bisa mengoreksi presensi (ubah waktu mulai/selesai, materi, evaluasi) — durasi & fee dihitung ulang otomatis.
- Durasi sesi dibatasi maksimal (config `BIMBEL_MAX_DURASI_MENIT`, default 480) sebagai pengaman jika tutor lupa menekan selesai.

### 5.4 Penagihan Otomatis via WhatsApp

- **W1. Trigger**: ketika sisa sesi siswa ≤ batas minimum (threshold), sistem mengirim notifikasi WhatsApp otomatis ke nomor orang tua siswa.
- **W2. Isi pesan**: informasi sisa sesi saat ini + informasi pembayaran (cara menghubungi admin / top-up sesi).
- **W3. WhatsApp API tier gratis**: memakai WhatsApp Cloud API tier gratis (template pesan, keterbatasan percakapan gratis — batas diterapkan sesuai aturan provider).
- **W4. Anti-duplikat**: tidak mengirim ulang untuk kondisi yang sama dalam satu paket yang sudah pernah diberitahu, kecuali threshold berikutnya tercapai.
- **W5. Status pengiriman** direkam (terkirim/gagal) dan tampil di A6.
- **W6. Retry**: notifikasi gagal bisa dikirim ulang manual oleh admin.
- **W7. Antrean**: pengiriman diproses async (queue) agar request tidak tertahan menunggu API WA; status perantara `diproses`.

## 6. Aturan Bisnis (rangkuman)

| Aturan | Detail |
|--------|--------|
| Pengurangan sisa sesi | −1 per presensi selesai. |
| Perhitungan fee | Rate per jam × durasi presensi (mulai → selesai), presisi menit. |
| Ambang notifikasi | Configurable (default: ≤ 3 sesi). |
| Presensi ganda | Satu tutor hanya boleh punya 1 presensi berjalan. |
| Isolasi data | Semua query tutor dibatasi scope user miliknya. Siswa diassign ke tutor (`siswa.tutor_id`); mulai presensi hanya untuk siswa yang diampu. |
| Koreksi data | Presensi/fee dikoreksi hanya oleh admin. |

## 7. Catatan Teknis

- Semua perhitungan sesi & fee diproses otomatis di **backend** (server-side), bukan di frontend, agar konsisten dan anti-manipulasi.
- Frontend: Inertia + React (proyek Laravel existing).
- Database: MySQL.
- Auth: role admin vs tutor pada tabel users.
- WA: WhatsApp Cloud API tier gratis; butuh konfigurasi (token, phone number ID, template pesan) yang terpisah dari kode.

## 8. Format Export Rekap (Spreadsheet)

Output rekap presensi & fee harus kompatibel dengan template Google Form yang sudah ada (`docs/PRESENSI SINA BIMBEL PRIVATE (Responses).xlsx`, ±3994 baris riwayat). Kolom export harus sama dengan kolom template:

| Kolom | Contoh isi | Sumber |
|-------|-----------|--------|
| Timestamp | `4/16/2026 9:57:00` | Sistem (kapan baris dibuat) |
| NAMA TUTOR | Delana | Otomatis dari akun tutor |
| NAMA SISWA DI GRUP | Uwa | Otomatis dari data siswa |
| NOMOR SISWA DI BELAKANG GRUP *jika ada | 2 | Data siswa |
| Kelas | Dewasa / 8 SMP | Data siswa |
| Mata Pelajaran | Bahasa Inggris | Data siswa / kelas |
| TINGKAT | Adult Beginner | Data siswa |
| TANGGAL | 3 Agustus 2026 | Tanggal presensi |
| WAKTU | 08:00 | Jam mulai presensi |
| SESI | `1 SESI (1 Jam)` / `2 SESI (2 Jam)` | Dihitung dari durasi presensi (mulai→selesai) |
| FEE | 40.0 | Rate per jam × durasi (otomatis backend) |
| MATERI | *teks* | Diisi tutor saat presensi (opsional) |
| EVALUASI (WAJIB COPY DARI GRUP) | *teks laporan* | Diisi tutor saat presensi (opsional) |
| KURIKULUM (SKIP UNTUK ADULT) | - | Opsional |

**Aturan:**
- Nilai SESI & FEE selalu dihitung sistem, bukan diisi manual (presisi menit).
- Rekap di-export per periode yang dipilih admin (dinamis), berformat .xlsx atau .csv.
- Rekap fee (A5) = agregat FEE per tutor per periode (untuk penggajian); rekap presensi (A4) = detail per baris seperti di atas.

## 9. Model Data (awal, untuk panduan generasi)

- `users` → `role` (admin/tutor), nama, email, password.
- `siswa` → nama, nomor WA, orang tua (opsional).
- `paket_sesi` → siswa_id, jumlah_sesi, sisa_sesi, tanggal.
- `rate_tutor` → user_id, nominal_per_jam.
- `presensi` → user_id (tutor), siswa_id, mulai, selesai, durasi.
- `fee` → presensi_id, jumlah (hasil kalkulasi).
- `notifikasi_wa` → siswa_id, isi pesan, status (terkirim/gagal), dikirim_pada.

## 10. Asumsi yang Perlu Dikonfirmasi (sebelum generate)

1. Apakah 1 siswa hanya punya 1 paket sesi aktif, atau bisa lebih dari satu? ✔ **Dikonfirmasi: lebih dari satu** (pengurangan dari paket tertua yang `sisa_sesi > 0`).
2. Threshold notifikasi default berapa sisa sesi? (asumsi: ≤ 3)
3. Hapus tutor: hard delete atau soft delete?
4. Fee dihitung per jam (rate per jam × durasi presensi mulai→selesai), presisi menit. ✔ **Dikonfirmasi**.
5. Nomor WA tujuan notifikasi: nomor siswa, orang tua, atau bisa diatur per siswa? ✔ **Dikonfirmasi: nomor orang tua**.
6. Apakah periode rekap admin dibuat dinamis (pilih tanggal mulai–akhir) — asumsi: ya, dinamis.
7. Format export rekap harus kompatibel dengan template Google Form existing (`docs/PRESENSI SINA BIMBEL PRIVATE (Responses).xlsx`) — ✔ **Dikonfirmasi** (lihat bagian 8).

## 11. Prioritas (urutan build)

1. **MVP**: Auth + role, kelola tutor/siswa/paket (A1, A2), rate fee (A3), presensi tutor + sisa sesi + fee otomatis (T3, T5, 5.3).
2. **Rekap & penggajian**: A4, A5.
3. **Penagihan & WhatsApp**: A7, W1–W5, A6.
