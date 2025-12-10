<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // Evaluación periódica de reglas cada 5 minutos
        $schedule->command('risk:evaluate --minutes=5')
            ->everyFiveMinutes()
            ->withoutOverlapping()
            ->runInBackground()
            ->appendOutputTo(storage_path('logs/risk-evaluation.log'));

        // Limpiar jobs fallidos antiguos (1 vez al día)
        $schedule->command('queue:flush')->daily();

        // Reiniciar queue workers (1 vez por hora)
        $schedule->command('queue:restart')->hourly();
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
