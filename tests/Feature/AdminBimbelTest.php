<?php

namespace Tests\Feature;

use App\Models\Fee;
use App\Models\NotifikasiWa;
use App\Models\PaketSesi;
use App\Models\Presensi;
use App\Models\RateKelas;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminBimbelTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->admin()->create();
    }

    private function tutor(): User
    {
        return User::factory()->create();
    }

    public function test_admin_dashboard_renders(): void
    {
        $this->actingAs($this->admin())
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Dashboard'));
    }

    public function test_tutor_tidak_bisa_akses_halaman_admin(): void
    {
        $this->actingAs($this->tutor())
            ->get(route('admin.tutor.index'))
            ->assertForbidden();
    }

    public function test_admin_tambah_tutor(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.tutor.store'), [
                'name' => 'Tutor Baru',
                'email' => 'baru@test.dev',
                'password' => 'rahasia123',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('users', ['email' => 'baru@test.dev', 'role' => 'tutor']);
    }

    public function test_admin_tambah_siswa_dengan_paket(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.siswa.store'), [
                'nama' => 'Siswa Test',
                'mata_pelajaran' => 'Matematika',
                'kelas' => '8 SMP',
                'nomor_wa_orang_tua' => '628111',
                'jumlah_sesi' => 10,
            ])
            ->assertRedirect();

        $siswa = Siswa::where('nama', 'Siswa Test')->first();
        $this->assertNotNull($siswa);
        $this->assertDatabaseHas('paket_sesi', [
            'siswa_id' => $siswa->id,
            'jumlah_sesi' => 10,
            'sisa_sesi' => 10,
        ]);
    }

    public function test_rekap_dan_export_renders(): void
    {
        $this->actingAs($this->admin())
            ->get(route('admin.rekap'))
            ->assertOk();

        $this->actingAs($this->admin())
            ->get(route('admin.rekap.export'))
            ->assertOk()
            ->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    public function test_rate_kelas_bisa_ditambah_dan_diubah_admin(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.rate-kelas.store'), [
                'kelas' => '10 SMA',
                'nominal_per_sesi' => 60000,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('rate_kelas', [
            'kelas' => '10 SMA',
            'nominal_per_sesi' => 60000,
        ]);

        $rk = RateKelas::where('kelas', '10 SMA')->first();

        $this->actingAs($this->admin())
            ->patch(route('admin.rate-kelas.update', $rk->id), [
                'kelas' => '10 SMA',
                'nominal_per_sesi' => 65000,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('rate_kelas', [
            'kelas' => '10 SMA',
            'nominal_per_sesi' => 65000,
        ]);
    }

    public function test_semua_halaman_admin_renders(): void
    {
        $this->actingAs($this->admin());

        foreach ([
            'admin.dashboard',
            'admin.tutor.index',
            'admin.siswa.index',
            'admin.rekap',
            'admin.notifikasi',
        ] as $route) {
            $this->get(route($route))->assertOk();
        }
    }

    public function test_tutor_dashboard_dan_riwayat_renders(): void
    {
        $this->actingAs($this->tutor())
            ->get(route('tutor.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Tutor/Dashboard'));

        $this->actingAs($this->tutor())
            ->get(route('tutor.riwayat'))
            ->assertOk();
    }

    public function test_penagihan_renders_dan_status_bisa_diubah(): void
    {
        $tutor = $this->tutor();
        $siswa = Siswa::create([
            'nama' => 'Siswa Penagihan',
            'mata_pelajaran' => 'Bahasa Inggris',
        ]);
        $paket = PaketSesi::create([
            'siswa_id' => $siswa->id,
            'jumlah_sesi' => 10,
            'sisa_sesi' => 5,
            'tanggal_mulai' => today(),
            'status_bayar' => 'belum_bayar',
        ]);

        $this->actingAs($this->admin())
            ->get(route('admin.penagihan'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Penagihan'));

        $this->actingAs($this->admin())
            ->patch(route('admin.penagihan.status', $paket->id), [
                'status_bayar' => 'lunas',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('paket_sesi', [
            'id' => $paket->id,
            'status_bayar' => 'lunas',
        ]);
        $this->assertNotNull($paket->fresh()->dibayar_pada);
    }

    public function test_filter_penagihan_per_status(): void
    {
        $tutor = $this->tutor();
        foreach (['belum_bayar', 'lunas'] as $status) {
            $siswa = Siswa::create([
                'nama' => 'Siswa '.$status,
                'mata_pelajaran' => 'Matematika',
            ]);
            PaketSesi::create([
                'siswa_id' => $siswa->id,
                'jumlah_sesi' => 5,
                'sisa_sesi' => 5,
                'tanggal_mulai' => today(),
                'status_bayar' => $status,
            ]);
        }

        $this->actingAs($this->admin())
            ->get(route('admin.penagihan', ['status' => 'belum_bayar']))
            ->assertOk();
    }

    public function test_admin_koreksi_presensi_menghitung_ulang_fee(): void
    {
        $tutor = $this->tutor();
        $siswa = Siswa::create([
            'nama' => 'Siswa Koreksi',
            'mata_pelajaran' => 'Bahasa Inggris',
        ]);
        $presensi = Presensi::create([
            'user_id' => $tutor->id,
            'siswa_id' => $siswa->id,
            'mulai' => now()->subHours(2),
            'selesai' => now()->subHour(),
            'durasi_menit' => 60,
        ]);
        Fee::create([
            'presensi_id' => $presensi->id,
            'jumlah' => 40000,
            'rate_per_sesi' => 40000,
        ]);

        $this->actingAs($this->admin())
            ->patch(route('admin.rekap.presensi.update', $presensi->id), [
                'mulai' => now()->subMinutes(180)->format('Y-m-d H:i:s'),
                'selesai' => now()->subMinutes(60)->format('Y-m-d H:i:s'),
                'materi' => 'Diperbaiki',
            ])
            ->assertRedirect();

        $presensi->refresh();
        $this->assertEquals(120, $presensi->durasi_menit);
        $this->assertEquals('Diperbaiki', $presensi->materi);
        // fee flat per sesi = 40.000 (tidak berubah walau durasi dikoreksi)
        $this->assertEquals(40000.0, $presensi->fee->jumlah);
    }

    public function test_retry_notifikasi_hanya_untuk_gagal(): void
    {
        $siswa = Siswa::create([
            'nama' => 'Siswa Retry',
            'mata_pelajaran' => 'Bahasa Inggris',
        ]);
        $paket = PaketSesi::create([
            'siswa_id' => $siswa->id,
            'jumlah_sesi' => 5,
            'sisa_sesi' => 2,
            'tanggal_mulai' => today(),
        ]);
        $notif = NotifikasiWa::create([
            'siswa_id' => $siswa->id,
            'paket_sesi_id' => $paket->id,
            'nomor_tujuan' => '62812345678',
            'isi_pesan' => 'test',
            'status' => 'gagal',
            'sisa_sesi_saat_kirim' => 2,
            'dikirim_pada' => now(),
        ]);

        $this->actingAs($this->admin())
            ->post(route('admin.notifikasi.retry', $notif->id))
            ->assertRedirect();
    }

    public function test_export_penagihan_csv(): void
    {
        $this->actingAs($this->admin())
            ->get(route('admin.penagihan.export'))
            ->assertOk()
            ->assertHeader('content-type', 'text/csv; charset=UTF-8');
    }

    public function test_register_dinonaktifkan(): void
    {
        $this->get('/register')->assertNotFound();
    }
}
