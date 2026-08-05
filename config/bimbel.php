<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Pengaturan Bimbel
    |--------------------------------------------------------------------------
    |
    | Threshold notifikasi: jumlah sisa sesi minimum yang memicu notifikasi WA.
    | Kontak admin yang ditampilkan di dalam pesan notifikasi.
    |
    */

    'notif_threshold' => (int) env('BIMBEL_NOTIF_THRESHOLD', 3),

    'admin_wa_contact' => env('BIMBEL_ADMIN_WA_CONTACT', 'Admin Bimbel'),

    // Batas maksimal durasi satu sesi (menit) sebagai pengaman jika tutor lupa
    // menekan "selesai". Sesi lebih lama akan dipotong ke nilai ini saat
    // dihitung durasi & fee. Disarankan admin mengoreksi via Rekap.
    'max_durasi_menit' => (int) env('BIMBEL_MAX_DURASI_MENIT', 480),
];
