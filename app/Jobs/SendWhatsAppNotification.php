<?php

namespace App\Jobs;

use App\Models\NotifikasiWa;
use App\Services\WhatsAppService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendWhatsAppNotification implements ShouldQueue
{
    use Queueable;

    public function __construct(public NotifikasiWa $notifikasi) {}

    public function handle(WhatsAppService $service): void
    {
        $service->sendNow($this->notifikasi);
    }
}
