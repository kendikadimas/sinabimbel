<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite menyimpan ENUM sebagai VARCHAR — tidak perlu alter.
        if (DB::connection()->getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("ALTER TABLE notifikasi_wa MODIFY COLUMN status ENUM('diproses','terkirim','gagal') NOT NULL DEFAULT 'diproses'");
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("ALTER TABLE notifikasi_wa MODIFY COLUMN status ENUM('terkirim','gagal') NOT NULL DEFAULT 'terkirim'");
    }
};
