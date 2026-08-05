# Database Requirements Specification (DBRS) — Sistem Manajemen Bimbel

> Acuan teknis basis data. Mengimplementasikan kebutuhan di `docs/PRD.md` dan `docs/userflow.md`.
> DBMS: **MySQL**. ORM: Eloquent (Laravel 13). Seluruh tabel memakai `InnoDB` + `utf8mb4`.

---

## 1. Konvensi

- **Naming**: tabel plural `snake_case`, PK `id` (BIGINT unsigned, auto-increment), kolom FK `{tabel_singular}_id`.
- **Timestamp**: semua tabel punya `created_at` / `updated_at` (migrasi default Laravel).
- **Soft delete**: `deleted_at` nullable — hanya untuk tabel master (`siswa`, `paket_sesi`, `presensi`). `users` tutor di-soft delete juga agar riwayat fee/presensi tidak putus (Asumsi #3 PRD: soft delete).
- **Uang & angka**: nominal uang pakai `DECIMAL(12,2)`; durasi menit pakai `SMALLINT UNSIGNED`.
- **Enum**: disimpan sebagai `ENUM` (nilai terkontrol) atau `VARCHAR` + constant class di app. Dipakai `ENUM` untuk role & status yang kaku.
- **Timezone**: simpan `TIMESTAMP` dalam UTC, render lokal saat tampil.
- **Validasi referensial**: FK dengan `ON DELETE RESTRICT` untuk data operasional, `CASCADE` untuk data turunan (paket→siswa).

---

## 2. Daftar Entitas

| # | Tabel | Fungsi | PRD |
|---|-------|--------|-----|
| 1 | `users` | Akun admin & tutor (Laravel default + kolom role) | T1, A1 |
| 2 | `siswa` | Data siswa + kelas + mata pelajaran + WA | A2 |
| 3 | `paket_sesi` | Paket sesi yang dimiliki siswa, sisa sesi, status bayar | A2, W1, penagihan |
| 4 | `rate_tutor` | Rate fee per jam per tutor | A3 |
| 5 | `presensi` | Aktivitas mengajar (mulai–selesai, materi, evaluasi) | T3, T4, A4 |
| 6 | `fee` | Hasil kalkulasi fee per presensi | A5, T5 |
| 7 | `notifikasi_wa` | Riwayat kirim notifikasi WhatsApp | A6, W1–W5 |

Tabel bawaan Laravel (tidak diubah, kecuali disebut): `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, `password_reset_tokens`, `sessions`, `personal_access_tokens` (Sanctum).

---

## 3. Spesifikasi Per-Tabel

### 3.1 `users`

Tabel default Laravel, ditambah kolom untuk kebutuhan bimbel.

| Kolom | Tipe | Null | Default | Keterangan |
|-------|------|------|---------|------------|
| id | BIGINT UNSIGNED | - | AI | PK |
| name | VARCHAR(255) | - | | Nama tutor/admin |
| email | VARCHAR(255) | - | | Unik |
| email_verified_at | TIMESTAMP | ✓ | NULL | |
| password | VARCHAR(255) | - | | Hashed |
| role | ENUM('admin','tutor') | - | 'tutor' | Hak akses (PRD §3) |
| nomor_wa | VARCHAR(20) | ✓ | NULL | Nomor WA tutor |
| remember_token | VARCHAR(100) | ✓ | NULL | |
| timestamps | | | | |

**Index**: `UNIQUE(email)`. **Index query umum**: `(role)`.

> Perubahan pada tabel existing: `php artisan make:migration add_role_to_users_table --table=users` (role + nomor_wa). Tidak menghapus kolom default.

---

### 3.2 `siswa`

Data siswa (dari form presensi existing: kelas, mapel, tingkat, nomor grup).

| Kolom | Tipe | Null | Default | Keterangan |
|-------|------|------|---------|------------|
| id | BIGINT UNSIGNED | - | AI | PK |
| tutor_id | BIGINT UNSIGNED | ✓ | NULL | FK → users.id — tutor pengampu (dasar isolasi data tutor) |
| nama | VARCHAR(255) | - | | Nama siswa di grup |
| nomor_grup | VARCHAR(20) | ✓ | NULL | "NOMOR SISWA DI BELAKANG GRUP *jika ada" |
| kelas | VARCHAR(50) | ✓ | NULL | Contoh: `Dewasa`, `8 SMP` |
| mata_pelajaran | VARCHAR(100) | - | | Contoh: `Bahasa Inggris` |
| tingkat | VARCHAR(100) | ✓ | NULL | Contoh: `Adult Beginner` (kolom "TINGKAT") |
| nomor_wa | VARCHAR(20) | ✓ | NULL | Nomor WA siswa |
| nama_orang_tua | VARCHAR(255) | ✓ | NULL | Opsional |
| nomor_wa_orang_tua | VARCHAR(20) | ✓ | NULL | Nomor WA tujuan notifikasi (Asumsi #5) |
| kurikulum | VARCHAR(100) | ✓ | NULL | "KURIKULUM (SKIP UNTUK ADULT)" |
| timestamps | | | | |
| deleted_at | TIMESTAMP | ✓ | NULL | Soft delete |

**FK**: `tutor_id → users.id ON DELETE SET NULL`.
**Index**: `INDEX(tutor_id)`, `INDEX(nama)`, `INDEX(mata_pelajaran)`.

> `nomor_wa` & `nama_orang_tua` jadi target notifikasi WA (Asumsi #5 PRD). Disimpan per siswa, bisa diubah admin.

---

### 3.3 `paket_sesi`

| Kolom | Tipe | Null | Default | Keterangan |
|-------|------|------|---------|------------|
| id | BIGINT UNSIGNED | - | AI | PK |
| siswa_id | BIGINT UNSIGNED | - | | FK → siswa.id |
| jumlah_sesi | SMALLINT UNSIGNED | - | | Total sesi di paket |
| sisa_sesi | SMALLINT UNSIGNED | - | | = jumlah_sesi saat dibuat |
| status_bayar | ENUM('belum_bayar','lunas') | - | 'belum_bayar' | Status penagihan |
| dibayar_pada | TIMESTAMP | ✓ | NULL | Waktu ditandai lunas |
| tanggal_mulai | DATE | - | | Tanggal paket dibuat/top-up |
| timestamps | | | | |
| deleted_at | TIMESTAMP | ✓ | NULL | Soft delete |

**FK**: `siswa_id → siswa.id ON DELETE CASCADE`.
**Index**: `INDEX(siswa_id)`, `INDEX(sisa_sesi)` (untuk query threshold W1).

**Aturan bisnis (5.3):**
- `sisa_sesi` hanya berkurang via backend saat presensi selesai (−1 per presensi). Tidak ada jalur update manual di UI.
- Jika satu siswa boleh punya >1 paket aktif (Asumsi #1 ✔), pengurangan dilakukan dari paket aktif pertama (tertua) yang `sisa_sesi > 0`. `CHECK (sisa_sesi >= 0)`.

---

### 3.4 `rate_tutor`

Satu baris = rate aktif per jam seorang tutor. Ubah rate = update baris ini (fee lama sudah tersimpan di `fee`, tidak terpengaruh).

| Kolom | Tipe | Null | Default | Keterangan |
|-------|------|------|---------|------------|
| id | BIGINT UNSIGNED | - | AI | PK |
| user_id | BIGINT UNSIGNED | - | | FK → users.id (role=tutor) |
| nominal_per_jam | DECIMAL(12,2) | - | | Rate fee per jam |
| timestamps | | | | |

**FK**: `user_id → users.id ON DELETE CASCADE`.
**Index**: `UNIQUE(user_id)` — satu rate aktif per tutor.
**CHECK**: `nominal_per_jam >= 0`.

---

### 3.5 `presensi`

| Kolom | Tipe | Null | Default | Keterangan |
|-------|------|------|---------|------------|
| id | BIGINT UNSIGNED | - | AI | PK |
| user_id | BIGINT UNSIGNED | - | | FK → users.id (tutor) |
| siswa_id | BIGINT UNSIGNED | - | | FK → siswa.id (siswa yang diajar) |
| mulai | DATETIME | - | | Jam mulai (dari backend, bukan klaim frontend) |
| selesai | DATETIME | ✓ | NULL | NULL = presensi aktif/berjalan |
| durasi_menit | SMALLINT UNSIGNED | ✓ | NULL | Diisi saat selesai (mulai→selesai) |
| materi | TEXT | ✓ | NULL | Diisi tutor, opsional |
| evaluasi | TEXT | ✓ | NULL | "EVALUASI (WAJIB COPY DARI GRUP)", opsional |
| timestamps | | | | |
| deleted_at | TIMESTAMP | ✓ | NULL | Soft delete (koreksi oleh admin) |

**FK**: `user_id → users.id ON DELETE RESTRICT`, `siswa_id → siswa.id ON DELETE RESTRICT`.
**Index**: `INDEX(user_id)`, `INDEX(siswa_id)`, `INDEX(user_id, selesai)` (rekap per tutor per periode), `INDEX(mulai)`.

**Constraint anti-presensi-ganda (T3):** satu tutor hanya boleh punya 1 baris dengan `selesai IS NULL`:
```sql
CREATE UNIQUE INDEX presensi_user_satu_aktif ON presensi (user_id) WHERE selesai IS NULL;
```
*(MySQL: partial index disimulasikan dengan kolom `status` ENUM berisi 'aktif'/'selesai' + `UNIQUE(user_id, status_aktif)` — lihat catatan implementasi di §6.)*

---

### 3.6 `fee`

| Kolom | Tipe | Null | Default | Keterangan |
|-------|------|------|---------|------------|
| id | BIGINT UNSIGNED | - | AI | PK |
| presensi_id | BIGINT UNSIGNED | - | | FK → presensi.id (unik) |
| jumlah | DECIMAL(12,2) | - | | Hasil kalkulasi: rate_per_jam × durasi_menit/60 |
| rate_per_jam | DECIMAL(12,2) | - | | Snapshot rate saat presensi selesai |
| timestamps | | | | |

**FK**: `presensi_id → presensi.id ON DELETE CASCADE`.
**Index**: `UNIQUE(presensi_id)`, `INDEX(user_id_snapshot)` jika diperlukan — cara aggregasi di §5.
**CHECK**: `jumlah >= 0`.

> Snapshot `rate_per_jam` penting: jika admin mengubah rate setelahnya, fee historis tetap valid untuk penggajian.

---

### 3.7 `notifikasi_wa`

| Kolom | Tipe | Null | Default | Keterangan |
|-------|------|------|---------|------------|
| id | BIGINT UNSIGNED | - | AI | PK |
| siswa_id | BIGINT UNSIGNED | - | | FK → siswa.id |
| paket_sesi_id | BIGINT UNSIGNED | - | | FK → paket_sesi.id |
| nomor_tujuan | VARCHAR(20) | - | | Snapshot nomor WA tujuan |
| isi_pesan | TEXT | - | | Isi lengkap pesan |
| status | ENUM('diproses','terkirim','gagal') | - | 'diproses' | Status dari API WA; 'diproses' = menunggu antrean kirim |
| sisa_sesi_saat_kirim | SMALLINT UNSIGNED | - | | Nilai sisa sesi saat dikirim |
| dikirim_pada | TIMESTAMP | - | | Waktu kirim |
| timestamps | | | | |

**FK**: `siswa_id → siswa.id ON DELETE RESTRICT`, `paket_sesi_id → paket_sesi.id ON DELETE CASCADE`.
**Index**: `UNIQUE(paket_sesi_id, sisa_sesi_saat_kirim)` — **anti-duplikat W4**: satu paket tidak kirim 2× pada nilai sisa yang sama.
**Index query A6**: `INDEX(status)`, `INDEX(dikirim_pada)`.

---

## 4. Relasi Antar Tabel

```
users (tutor) 1 ─── 1 rate_tutor        (rate aktif per tutor)
users (tutor) 1 ─── N presensi          (riwayat mengajar)
siswa        1 ─── N paket_sesi         (paket sesi yang dimiliki)
siswa        1 ─── N presensi           (diajar berkali-kali)
presensi     1 ─── 1 fee                (satu presensi → satu fee)
siswa        1 ─── N notifikasi_wa
paket_sesi   1 ─── N notifikasi_wa
```

### Alur kritikal (transaksi, 5.3)
Saat **presensi selesai**, satu transaksi DB mengerjakan:
1. Set `presensi.selesai` + hitung `durasi_menit`.
2. Kurangi `paket_sesi.sisa_sesi` −1 (paket aktif tertua, `sisa_sesi > 0`).
3. Insert `fee` (jumlah = snapshot rate × durasi).
4. (Jika `sisa_sesi <= threshold`) kirim notifikasi WA + insert `notifikasi_wa`.

Jika langkah mana pun gagal → seluruh transaksi rollback (tidak ada sisa sesi berkurang tanpa fee, dst).

---

## 5. Query Rekap (A4, A5)

**Rekap presensi per periode (A4)** — filter `user_id`, `presensi.mulai` dalam `[tanggal_awal, tanggal_akhir]`, hanya `selesai IS NOT NULL`:
```sql
SELECT p.id, p.mulai, p.selesai, p.durasi_menit, p.materi, p.evaluasi,
       s.nama AS siswa, s.kelas, s.mata_pelajaran, s.tingkat, s.nomor_grup,
       u.name AS tutor, f.jumlah AS fee
FROM presensi p
JOIN siswa s ON s.id = p.siswa_id
JOIN users u ON u.id = p.user_id
LEFT JOIN fee f ON f.presensi_id = p.id
WHERE p.selesai IS NOT NULL
  AND p.mulai >= :awal AND p.mulai <= :akhir
ORDER BY p.mulai;
```

**Rekap fee per tutor per periode (A5):**
```sql
SELECT u.id AS tutor_id, u.name AS tutor,
       COUNT(*) AS jumlah_sesi, SUM(f.jumlah) AS total_fee
FROM presensi p
JOIN users u ON u.id = p.user_id
JOIN fee f ON f.presensi_id = p.id
WHERE p.selesai IS NOT NULL AND p.mulai >= :awal AND p.mulai <= :akhir
GROUP BY u.id, u.name
ORDER BY total_fee DESC;
```

**Deteksi notifikasi (W1)** — daftar paket yang `sisa_sesi <= threshold` dan belum pernah dikirim di nilai sisa itu:
```sql
SELECT ps.id, ps.sisa_sesi, s.id AS siswa_id, s.nama, s.nomor_wa
FROM paket_sesi ps
JOIN siswa s ON s.id = ps.siswa_id
WHERE ps.sisa_sesi <= :threshold
  AND ps.deleted_at IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM notifikasi_wa n
    WHERE n.paket_sesi_id = ps.id AND n.sisa_sesi_saat_kirim = ps.sisa_sesi
  );
```

---

## 6. Catatan Implementasi (MySQL / Eloquent)

1. **Partial index MySQL**: MySQL tidak mendukung `WHERE` pada index. Anti-presensi-ganda diterapkan via kolom bantu `status_aktif` TINYINT nullable pada `presensi`: berisi `1` hanya saat presensi berjalan, `NULL` saat selesai (MySQL mengizinkan duplikat NULL pada unique index), lalu `UNIQUE(user_id, status_aktif)`. Dengan ini hanya satu presensi aktif per tutor yang mungkin. *(ponytail: jika beban single-tutor jelas, alternatif lebih sederhana adalah guard di service layer tanpa index unik.)*
2. **Enum vs constant**: role & status pakai `ENUM`. Referensi nilai di app lewat constant class (mis. `App\Enums\UserRole`, `App\Enums\NotifStatus`).
3. **Snapshot** `fee.rate_per_jam` dan `notifikasi_wa.nomor_tujuan` agar data historis tidak berubah saat data master diubah.
4. **Waktu**: `DATETIME` untuk presensi (waktu lokal operasional jelas), `TIMESTAMP` untuk audit (`dikirim_pada`, `created_at`). Konsistenkan timezone di config `app.timezone`.
5. **Urutan migration**: 1) tambah kolom `users` → 2) `siswa` → 3) `paket_sesi` → 4) `rate_tutor` → 5) `presensi` → 6) `fee` → 7) `notifikasi_wa`.

---

## 7. Matriks Kebutuhan → Tabel

| Kebutuhan PRD | Tabel |
|---------------|-------|
| A1 Kelola akun tutor | `users` (role=tutor) |
| A2 Siswa & paket sesi | `siswa`, `paket_sesi` |
| A3 Rate fee | `rate_tutor` |
| A4 Rekap presensi per periode | `presensi` (+ `siswa`, `users`, `fee`) |
| A5 Rekap fee / penggajian | `fee`, `presensi` |
| A6 Monitoring notif WA | `notifikasi_wa` |
| T3 Presensi mulai/selesai | `presensi` (selesai NULL = berjalan) |
| T5 Fee real-time | `fee` |
| W1–W5 Notifikasi otomatis | `paket_sesi`, `notifikasi_wa`, `siswa` |
| Format export (PRD §8) | gabungan kolom: `siswa`+`presensi`+`fee` |

---

## 8. Tergantung Konfirmasi (blokir desain final)

1. Asumsi #1 PRD: satu siswa bisa punya **lebih dari satu paket aktif** — ✔ **Dikonfirmasi**. Pengurangan dari paket tertua yang `sisa_sesi > 0`.
2. Asumsi #5 PRD: nomor WA tujuan notifikasi = **nomor WA orang tua** — ✔ **Dikonfirmasi** (`siswa.nomor_wa_orang_tua`).
3. Nilai-nilai `ENUM` `notifikasi_wa.status`: cukup `terkirim/gagal`, atau perlu `diproses` (antrean) untuk retry?
4. Threshold notifikasi default (≤ 3) — konfigurasi via `.env` atau tabel `settings`?
