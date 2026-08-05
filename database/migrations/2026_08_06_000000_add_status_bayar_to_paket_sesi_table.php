<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('paket_sesi', function (Blueprint $table) {
            $table->enum('status_bayar', ['belum_bayar', 'lunas'])->default('belum_bayar')->after('sisa_sesi');
            $table->timestamp('dibayar_pada')->nullable()->after('status_bayar');
        });
    }

    public function down(): void
    {
        Schema::table('paket_sesi', function (Blueprint $table) {
            $table->dropColumn(['status_bayar', 'dibayar_pada']);
        });
    }
};
