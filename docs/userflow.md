# User Flow — Sistem Manajemen Bimbel (sinabimbel)

> Berdasarkan `docs/PRD.md`. Flow berikut adalah alur utama yang harus didukung sistem. Nomor fitur (A1, T3, W1, dst.) merujuk ke PRD.

---

## 1. Login & Role

```mermaid
flowchart LR
    A[Pengguna buka aplikasi] --> B{Login}
    B -- kredensial valid --> C{Role}
    B -- gagal --> B
    C -- admin --> D[Redirect ke Dashboard Admin]
    C -- tutor --> E[Redirect ke Dashboard Tutor]
    D --> F[Semua data & fitur PRD]
    E --> G[Hanya data milik tutor]
```

**Aturan:**
- Belum login → akses halaman dashboard ditolak, diarahkan ke login.
- Role menentukan halaman yang bisa dibuka (T1, T2).

---

## 2. Kelola Akun Tutor (Admin — A1)

```mermaid
flowchart TD
    A[Admin buka menu Tutor] --> B{Lihat daftar tutor}
    B --> C[Tambah tutor]
    B --> D[Edit tutor]
    B --> E[Hapus tutor]
    C --> C1[Isi nama, email, password] --> C2[Simpan]
    D --> D1[Ubah data / reset password] --> D2[Simpan]
    E --> E1{Tutor punya data terkait?}
    E1 -- tidak --> E2[Hapus akun]
    E1 -- ya --> E3[Tolak hapus / beri peringatan]
```

**Aturan:** password bisa diatur saat tambah dan direset saat edit.

---

## 3. Kelola Siswa & Paket Sesi (Admin — A2)

```mermaid
flowchart TD
    A[Admin buka menu Siswa] --> B[Tambah / edit siswa]
    B --> B1[Nama, nomor WA, orang tua opsional]
    A --> C[Kelola paket sesi]
    C --> C1[Tambah paket: jumlah sesi awal]
    C --> C2[Lihat sisa sesi tiap paket]
    C --> C3[Top-up sesi]
```

**Aturan:** sisa sesi tidak diubah manual dari sini — hanya berkurang otomatis via presensi (5.3). Admin bisa menambah paket baru / top-up.

---

## 4. Atur Rate Fee Tutor (Admin — A3)

```mermaid
flowchart LR
    A[Admin buka detail tutor] --> B[Isi nominal rate per jam] --> C[Simpan]
    C --> D[Rate dipakai untuk hitung fee otomatis]
```

---

## 5. Rekap Presensi & Fee per Periode (Admin — A4, A5)

```mermaid
flowchart TD
    A[Admin buka menu Rekap] --> B[Pilih periode: tanggal mulai - selesai]
    B --> C[Lihat rekap per tutor]
    C --> C1[Daftar presensi + durasi mengajar]
    C --> C2[Total fee otomatis per tutor]
    C2 --> D[Digunakan untuk penggajian]
```

**Aturan:** periode dinamis (asumsi #6 PRD). Total fee = hasil kalkulasi backend dari presensi × rate.

---

## 6. Presensi Mengajar (Tutor — T3, T4, T5)

```mermaid
flowchart TD
    A[Tutor login] --> B[Open dashboard tutor]
    B --> C{Tekan tombol Mulai Mengajar}
    C --> D[Pilih siswa yang diajar] --> E[Presensi aktif dicatat]
    E --> F[Backend simpan waktu mulai]
    F --> G{Tekan Selesai Mengajar}
    G --> H[Backend catat waktu selesai + hitung durasi]
    H --> I1[Sisa sesi siswa -1]
    H --> I2[Fee dihitung otomatis: rate x durasi presisi menit]
    H --> I3[Riwayat mengajar muncul]
    I2 --> J[Fee tampil real-time di dashboard tutor]
```

**Aturan:**
- Satu tutor hanya boleh punya 1 presensi berjalan (presensi ganda ditolak).
- Waktu mulai/selesai dicatat di backend, bukan klaim dari frontend (anti-manipulasi).
- Presensi selesai tidak bisa diedit tutor (koreksi hanya admin).
- Sisa sesi −1 diproses backend setelah presensi selesai (5.3).

---

## 7. Penagihan Otomatis via WhatsApp (W1–W5)

```mermaid
flowchart TD
    A[Presensi selesai: sisa sesi -1] --> B{Backend cek sisa sesi <= threshold?}
    B -- tidak --> Z[Tidak ada notifikasi]
    B -- ya --> C{Sudah pernah dikirim untuk kondisi paket ini?}
    C -- sudah, threshold sama --> Z
    C -- belum --> D[Susun pesan: sisa sesi + info pembayaran]
    D --> E[Kirim via WhatsApp API tier gratis]
    E --> F[Backend rekam status: terkirim / gagal]
    F --> G[Tampil di monitoring admin A6]
```

**Aturan (W4):** anti-duplikat — tidak kirim ulang untuk threshold yang sama pada paket yang sama; kirim lagi hanya saat threshold berikutnya tercapai (mis. ≤ 3, lalu ≤ 1).

---

## 8. Monitoring Notifikasi (Admin — A6)

```mermaid
flowchart LR
    A[Admin buka menu Notifikasi WA] --> B[Lihat daftar pengiriman]
    B --> B1[Isi pesan]
    B --> B2[Status: terkirim / gagal]
    B --> B3[Waktu kirim]
```
