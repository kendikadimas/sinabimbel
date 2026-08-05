<?php

namespace App\Enums;

enum NotifStatus: string
{
    case Diproses = 'diproses';
    case Terkirim = 'terkirim';
    case Gagal = 'gagal';

    public function label(): string
    {
        return match ($this) {
            self::Diproses => 'Diproses',
            self::Terkirim => 'Terkirim',
            self::Gagal => 'Gagal',
        };
    }
}
