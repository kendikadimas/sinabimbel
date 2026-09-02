<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');        // create, update, delete, sent, login, etc.
            $table->string('subject_type')->nullable(); // e.g. Tutor, Siswa, PaketSesi
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->string('description');
            $table->json('meta')->nullable(); // extra context
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
