<?php

namespace Tests\Feature;

use App\Jobs\SendWhatsAppNotification;
use App\Models\PaketSesi;
use App\Models\RateKelas;
use App\Models\Siswa;
use App\Models\User;
use App\Services\PresensiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class PresensiServiceTest extends TestCase
{
    use RefreshDatabase;

    private function makeTutor(): User
    {
        return User::factory()->create();
    }

    private function makeSiswaWithPaket(int $sisa = 5, ?User $tutor = null, ?string $kelas = '8 SMP'): array
    {
        $siswa = Siswa::create([
            'nama' => 'Siswa Test',
            'mata_pelajaran' => 'Bahasa Inggris',
            'nomor_wa_orang_tua' => '62812345678',
            'tutor_id' => $tutor?->id,
            'kelas' => $kelas,
        ]);
        RateKelas::firstOrCreate(
            ['kelas' => $kelas],
            ['nominal_per_jam' => 40000],
        );
        $paket = PaketSesi::create([
            'siswa_id' => $siswa->id,
            'jumlah_sesi' => $sisa,
            'sisa_sesi' => $sisa,
            'tanggal_mulai' => today(),
        ]);

        return [$siswa, $paket];
    }

    public function test_fee_dihitung_dari_durasi_presisi_menit(): void
    {
        $tutor = $this->makeTutor();
        [$siswa] = $this->makeSiswaWithPaket(5, $tutor);

        $service = app(PresensiService::class);
        $presensi = $service->mulai($tutor, $siswa->id);
        $presensi->update(['mulai' => now()->subMinutes(90)]);
        $selesai = $service->selesai($presensi);

        $this->assertEquals(90, $selesai->durasi_menit);
        // 40.000 / jam × 90 menit = 60.000
        $this->assertEquals(60000.0, $selesai->fee->jumlah);
        $this->assertEquals(40000, $selesai->fee->rate_per_jam);
    }

    public function test_sisa_sesi_berkurang_satu(): void
    {
        $tutor = $this->makeTutor();
        [$siswa, $paket] = $this->makeSiswaWithPaket(5, $tutor);

        $service = app(PresensiService::class);
        $presensi = $service->mulai($tutor, $siswa->id);
        $presensi->update(['mulai' => now()->subMinutes(60)]);
        $service->selesai($presensi);

        $this->assertEquals(4, $paket->fresh()->sisa_sesi);
    }

    public function test_presensi_ganda_ditolak(): void
    {
        $tutor = $this->makeTutor();
        [$siswa] = $this->makeSiswaWithPaket(5, $tutor);

        $service = app(PresensiService::class);
        $service->mulai($tutor, $siswa->id);

        $this->expectException(\DomainException::class);
        $service->mulai($tutor, $siswa->id);
    }

    public function test_notifikasi_dikirim_saat_sisa_mencapai_threshold(): void
    {
        $tutor = $this->makeTutor();
        [$siswa, $paket] = $this->makeSiswaWithPaket(3, $tutor);

        $service = app(PresensiService::class);
        $presensi = $service->mulai($tutor, $siswa->id);
        $presensi->update(['mulai' => now()->subMinutes(60)]);
        $service->selesai($presensi);

        $this->assertEquals(2, $paket->fresh()->sisa_sesi);
        $this->assertDatabaseHas('notifikasi_wa', [
            'paket_sesi_id' => $paket->id,
            'sisa_sesi_saat_kirim' => 2,
            'nomor_tujuan' => '62812345678',
        ]);
    }

    public function test_selesai_tanpa_rate_kelas_menolak(): void
    {
        $tutor = User::factory()->create();
        // Kelas 'Kelas Tanpa Rate' sengaja tidak dibuat di rate_kelas.
        [$siswa] = $this->makeSiswaWithPaket(5, $tutor, 'Kelas Tanpa Rate');
        RateKelas::where('kelas', 'Kelas Tanpa Rate')->delete();

        $service = app(PresensiService::class);
        $presensi = $service->mulai($tutor, $siswa->id);

        $this->expectException(\DomainException::class);
        $service->selesai($presensi);
    }

    public function test_tutor_bisa_memiliki_banyak_presensi_selesai(): void
    {
        $tutor = $this->makeTutor();
        [$siswa] = $this->makeSiswaWithPaket(10, $tutor);

        $service = app(PresensiService::class);

        foreach ([1, 2, 3] as $i) {
            $presensi = $service->mulai($tutor, $siswa->id);
            $presensi->update(['mulai' => now()->subMinutes(60)]);
            $service->selesai($presensi);
        }

        $this->assertDatabaseCount('presensi', 3);
        $this->assertDatabaseHas('paket_sesi', [
            'id' => $siswa->paketSesi()->first()->id,
            'sisa_sesi' => 7,
        ]);
    }

    public function test_durasi_maksimal_dibatasi(): void
    {
        config(['bimbel.max_durasi_menit' => 120]);

        $tutor = $this->makeTutor();
        [$siswa] = $this->makeSiswaWithPaket(5, $tutor);

        $service = app(PresensiService::class);
        $presensi = $service->mulai($tutor, $siswa->id);
        $presensi->update(['mulai' => now()->subHours(6)]);
        $selesai = $service->selesai($presensi);

        $this->assertEquals(120, $selesai->durasi_menit);
        // 40.000 × 2 jam = 80.000, bukan 240.000
        $this->assertEquals(80000.0, $selesai->fee->jumlah);
    }

    public function test_notifikasi_status_diproses_lalu_dikirim(): void
    {
        Queue::fake();

        $tutor = $this->makeTutor();
        [$siswa, $paket] = $this->makeSiswaWithPaket(3, $tutor);

        $service = app(PresensiService::class);
        $presensi = $service->mulai($tutor, $siswa->id);
        $presensi->update(['mulai' => now()->subMinutes(60)]);
        $service->selesai($presensi);

        Queue::assertPushed(
            SendWhatsAppNotification::class,
        );
        $this->assertDatabaseHas('notifikasi_wa', [
            'paket_sesi_id' => $paket->id,
            'status' => 'diproses',
        ]);
    }

    public function test_mulai_menolak_siswa_bukan_ampuan(): void
    {
        $tutor = $this->makeTutor();
        $tutorLain = User::factory()->create();
        [$siswa] = $this->makeSiswaWithPaket(5, $tutorLain);

        $service = app(PresensiService::class);

        $this->expectException(\DomainException::class);
        $service->mulai($tutor, $siswa->id);
    }

    public function test_mulai_menolak_siswa_tanpa_sisa_sesi(): void
    {
        $tutor = $this->makeTutor();
        [$siswa] = $this->makeSiswaWithPaket(0, $tutor);

        $service = app(PresensiService::class);

        $this->expectException(\DomainException::class);
        $service->mulai($tutor, $siswa->id);
    }

    public function test_mulai_menolak_siswa_tanpa_tutor_assign(): void
    {
        $tutor = $this->makeTutor();
        [$siswa] = $this->makeSiswaWithPaket(5);

        $service = app(PresensiService::class);

        $this->expectException(\DomainException::class);
        $service->mulai($tutor, $siswa->id);
    }
}
