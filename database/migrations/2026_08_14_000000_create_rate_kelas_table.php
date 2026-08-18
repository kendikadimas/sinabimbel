<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rate_kelas', function (Blueprint $table) {
            $table->id();
            $table->string('kelas')->unique();
            $table->decimal('nominal_per_jam', 12, 2);
            $table->timestamps();
        });

        Schema::dropIfExists('rate_tutor');
    }

    public function down(): void
    {
        Schema::create('rate_tutor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('nominal_per_jam', 12, 2);
            $table->timestamps();

            $table->unique('user_id');
        });

        Schema::dropIfExists('rate_kelas');
    }
};
