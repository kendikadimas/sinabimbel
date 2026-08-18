<?php

namespace Database\Seeders;

use App\Models\Fee;
use App\Models\NotifikasiWa;
use App\Models\PaketSesi;
use App\Models\Presensi;
use App\Models\RateKelas;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@sinabimbel.test'],
            [
                'name' => 'Admin Sina Bimbel',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ],
        );

        // Rate fee per kelas (bukan per tutor).
        $rateKelas = [
            ['kelas' => '8 SMP', 'nominal_per_jam' => 40_000],
            ['kelas' => '9 SMP', 'nominal_per_jam' => 45_000],
            ['kelas' => 'Dewasa', 'nominal_per_jam' => 50_000],
        ];
        foreach ($rateKelas as $rk) {
            RateKelas::firstOrCreate(['kelas' => $rk['kelas']], ['nominal_per_jam' => $rk['nominal_per_jam']]);
        }

        $tutors = [
            ['name' => 'Ms. Resti', 'email' => 'resti@sinabimbel.test', 'nomor_wa' => '62811111111'],
            ['name' => 'Delana', 'email' => 'delana@sinabimbel.test', 'nomor_wa' => '62822222222'],
            ['name' => 'Tutor Bahasa Inggris', 'email' => 'tutor@sinabimbel.test', 'nomor_wa' => '62833333333'],
        ];

        $siswa = [];

        foreach ($tutors as $t) {
            $user = User::firstOrCreate(
                ['email' => $t['email']],
                [
                    'name' => $t['name'],
                    'password' => Hash::make('password'),
                    'role' => 'tutor',
                    'nomor_wa' => $t['nomor_wa'],
                    'email_verified_at' => now(),
                ],
            );

            foreach ([1, 2, 3] as $i) {
                $nama = "Siswa {$i} - {$t['name']}";
                $siswa[] = Siswa::updateOrCreate(
                    ['nama' => $nama],
                    [
                        'tutor_id' => $user->id,
                        'kelas' => ['8 SMP', '9 SMP', 'Dewasa'][$i - 1],
                        'mata_pelajaran' => 'Bahasa Inggris',
                        'tingkat' => $i === 3 ? 'Adult Beginner' : null,
                        'nomor_wa' => "6280000000{$i}",
                        'nama_orang_tua' => "Orang Tua {$i}",
                        'nomor_wa_orang_tua' => "6289999999{$i}",
                        'kurikulum' => $i === 3 ? null : 'K13',
                    ],
                );
            }
        }

        // Paket sesi untuk setiap siswa (idempotent: satu paket per siswa).
        // Variasi sisa: sebagian rendah (memicu notifikasi WA) agar monitoring
        // & penagihan terlihat terisi.
        $sisaPattern = [2, 5, 8, 3, 6, 9, 1, 4, 7];
        foreach ($siswa as $i => $s) {
            $sisa = $sisaPattern[$i % count($sisaPattern)];
            PaketSesi::firstOrCreate(
                ['siswa_id' => $s->id],
                [
                    'jumlah_sesi' => 20,
                    'sisa_sesi' => $sisa,
                    'tanggal_mulai' => now()->subMonth(),
                    'status_bayar' => $i % 2 === 0 ? 'lunas' : 'belum_bayar',
                    'dibayar_pada' => $i % 2 === 0 ? now()->subWeek() : null,
                ],
            );
        }

        // Data historis presensi + fee + notifikasi — hanya di-seed jika tabel
        // presensi masih kosong, agar `db:seed` berulang tidak menggandakan.
        if (Presensi::count() === 0) {
            $this->seedPresensi($siswa);
        }
    }

    private function seedPresensi(array $siswa): void
    {
        $materi = [
            'Present Continuous Tense',
            'Simple Past Tense',
            'Reading Comprehension',
            'Vocabulary Building',
            'Listening Practice',
            'Speaking & Conversation',
            'Question Tag',
            'Possessive Adjectives',
            'Procedure Text',
            'Daily Routine',
        ];

        $dummyTutor = User::where('role', 'tutor')->first();
        $perSiswa = (int) floor(20 / count($siswa)) ?: 2;

        DB::transaction(function () use ($siswa, $materi, $perSiswa, $dummyTutor) {
            foreach ($siswa as $s) {
                $paket = $s->paketSesi()->first();
                $tutorId = $s->tutor_id ?? $dummyTutor->id;
                $rate = RateKelas::where('kelas', $s->kelas)->first()?->nominal_per_jam ?? 40000;
                $count = 0;

                for ($day = 45; $day >= 0 && $count < $perSiswa; $day--) {
                    // Tidak semua hari ada sesi, beri variasi merata (termasuk
                    // 7 hari terakhir) agar grafik dashboard tidak menggumpal.
                    if (rand(1, 100) > 50) {
                        continue;
                    }

                    $mulai = now()->subDays($day)->setTime(rand(9, 18), rand(0, 59));
                    $durasi = rand(60, 120);
                    $selesai = $mulai->copy()->addMinutes($durasi);
                    $fee = round($rate * $durasi / 60, 2);

                    $presensi = Presensi::create([
                        'user_id' => $tutorId,
                        'siswa_id' => $s->id,
                        'mulai' => $mulai,
                        'selesai' => $selesai,
                        'durasi_menit' => $durasi,
                        'materi' => $materi[array_rand($materi)],
                        'evaluasi' => 'Siswa memahami materi dengan baik, perlu latihan lanjutan.',
                        'status_aktif' => null,
                    ]);

                    Fee::create([
                        'presensi_id' => $presensi->id,
                        'jumlah' => $fee,
                        'rate_per_jam' => $rate,
                    ]);

                    $count++;
                }

                // Tambahkan sesi di 7 hari terakhir (termasuk hari ini) agar
                // grafik dashboard terisi & terlihat.
                foreach ([0, 1, 2, 3, 4, 5] as $offset) {
                    if (rand(1, 100) > 75) {
                        continue;
                    }

                    $mulai = now()->subDays($offset)->setTime(rand(8, 16), rand(0, 59));
                    $durasi = rand(60, 120);
                    $selesai = $mulai->copy()->addMinutes($durasi);
                    $fee = round($rate * $durasi / 60, 2);

                    $presensi = Presensi::create([
                        'user_id' => $tutorId,
                        'siswa_id' => $s->id,
                        'mulai' => $mulai,
                        'selesai' => $selesai,
                        'durasi_menit' => $durasi,
                        'materi' => $materi[array_rand($materi)],
                        'evaluasi' => 'Siswa memahami materi dengan baik, perlu latihan lanjutan.',
                        'status_aktif' => null,
                    ]);

                    Fee::create([
                        'presensi_id' => $presensi->id,
                        'jumlah' => $fee,
                        'rate_per_jam' => $rate,
                    ]);
                }
            }

            // Notifikasi WA untuk paket dengan sisa sesi rendah.
            $this->seedNotifikasi($siswa);
        });
    }

    private function seedNotifikasi(array $siswa): void
    {
        $paket = PaketSesi::where('sisa_sesi', '<=', 3)->get();

        foreach ($paket as $p) {
            if ($p->sisa_sesi <= 0) {
                continue;
            }

            $gagal = rand(1, 100) <= 30;
            NotifikasiWa::firstOrCreate(
                ['paket_sesi_id' => $p->id, 'sisa_sesi_saat_kirim' => $p->sisa_sesi],
                [
                    'siswa_id' => $p->siswa_id,
                    'nomor_tujuan' => $p->siswa->nomor_wa_orang_tua ?: $p->siswa->nomor_wa,
                    'isi_pesan' => "Halo {$p->siswa->nama_orang_tua}, sisa sesi belajar {$p->siswa->nama} tinggal {$p->sisa_sesi} sesi. Mohon segera melakukan pembayaran / top-up. Terima kasih.",
                    'status' => $gagal ? 'gagal' : 'terkirim',
                    'dikirim_pada' => now()->subDays(rand(0, 6))->addHours(rand(8, 17)),
                ],
            );
        }
    }
}
