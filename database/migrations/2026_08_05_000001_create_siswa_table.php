<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('nomor_grup', 20)->nullable();
            $table->string('kelas', 50)->nullable();
            $table->string('mata_pelajaran', 100);
            $table->string('tingkat', 100)->nullable();
            $table->string('nomor_wa', 20)->nullable();
            $table->string('nama_orang_tua', 255)->nullable();
            $table->string('nomor_wa_orang_tua', 20)->nullable();
            $table->string('kurikulum', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('nama');
            $table->index('mata_pelajaran');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
