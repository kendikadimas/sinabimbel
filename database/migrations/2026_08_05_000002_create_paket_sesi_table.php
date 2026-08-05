<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paket_sesi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->cascadeOnDelete();
            $table->unsignedSmallInteger('jumlah_sesi');
            $table->unsignedSmallInteger('sisa_sesi');
            $table->date('tanggal_mulai');
            $table->timestamps();
            $table->softDeletes();

            $table->index('siswa_id');
            $table->index('sisa_sesi');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paket_sesi');
    }
};
