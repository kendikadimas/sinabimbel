<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fee', function (Blueprint $table) {
            $table->id();
            $table->foreignId('presensi_id')->constrained('presensi')->cascadeOnDelete();
            $table->decimal('jumlah', 12, 2);
            $table->decimal('rate_per_jam', 12, 2);
            $table->timestamps();

            $table->unique('presensi_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee');
    }
};
