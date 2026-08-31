<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifikasi_wa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->restrictOnDelete();
            $table->foreignId('paket_sesi_id')->constrained('paket_sesi')->cascadeOnDelete();
            $table->string('nomor_tujuan', 20);
            $table->text('isi_pesan');
            $table->enum('status', ['diproses', 'terkirim', 'gagal'])->default('diproses');
            $table->unsignedSmallInteger('sisa_sesi_saat_kirim');
            $table->timestamp('dikirim_pada')->nullable();
            $table->timestamps();

            $table->unique(['paket_sesi_id', 'sisa_sesi_saat_kirim']);
            $table->index('siswa_id');
            $table->index('status');
            $table->index('dikirim_pada');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifikasi_wa');
    }
};
