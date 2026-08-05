<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('siswa_id')->constrained('siswa')->restrictOnDelete();
            $table->dateTime('mulai');
            $table->dateTime('selesai')->nullable();
            $table->unsignedSmallInteger('durasi_menit')->nullable();
            $table->text('materi')->nullable();
            $table->text('evaluasi')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // MySQL tidak mendukung partial index; simulasikan via kolom bantu:
            // NULL = sudah selesai (NULL diizinkan duplikat), 1 = sedang aktif.
            // UNIQUE(user_id, status_aktif) → hanya 1 presensi aktif per tutor.
            $table->tinyInteger('status_aktif')->nullable();
            $table->unique(['user_id', 'status_aktif']);

            $table->index('siswa_id');
            $table->index('mulai');
            $table->index(['user_id', 'selesai']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presensi');
    }
};
