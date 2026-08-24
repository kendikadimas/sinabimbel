<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mata_pelajaran', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 100)->unique();
            $table->timestamps();
        });

        Schema::create('kurikulum', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 100)->unique();
            $table->timestamps();
        });

        Schema::create('tutor_mata_pelajaran', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajaran')->cascadeOnDelete();
            $table->primary(['user_id', 'mata_pelajaran_id']);
        });

        Schema::table('siswa', function (Blueprint $table) {
            $table->dropColumn('tingkat');
        });
    }

    public function down(): void
    {
        Schema::table('siswa', function (Blueprint $table) {
            $table->string('tingkat', 100)->nullable();
        });

        Schema::dropIfExists('tutor_mata_pelajaran');
        Schema::dropIfExists('kurikulum');
        Schema::dropIfExists('mata_pelajaran');
    }
};
