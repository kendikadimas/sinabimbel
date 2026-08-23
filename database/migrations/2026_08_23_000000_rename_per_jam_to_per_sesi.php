<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rate_kelas', function (Blueprint $table) {
            $table->renameColumn('nominal_per_jam', 'nominal_per_sesi');
        });

        Schema::table('fee', function (Blueprint $table) {
            $table->renameColumn('rate_per_jam', 'rate_per_sesi');
        });
    }

    public function down(): void
    {
        Schema::table('rate_kelas', function (Blueprint $table) {
            $table->renameColumn('nominal_per_sesi', 'nominal_per_jam');
        });

        Schema::table('fee', function (Blueprint $table) {
            $table->renameColumn('rate_per_sesi', 'rate_per_jam');
        });
    }
};
