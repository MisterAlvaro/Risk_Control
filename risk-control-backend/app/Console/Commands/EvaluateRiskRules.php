<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Application\Services\RuleEvaluationService;

class EvaluateRiskRules extends Command
{
    protected $signature = 'risk:evaluate {--minutes=5 : Minutes to look back}';
    protected $description = 'Evaluate risk rules for recently closed trades';

    public function handle(RuleEvaluationService $evaluationService): void
    {
        $minutes = $this->option('minutes');

        $this->info("Evaluating risk rules for trades closed in the last {$minutes} minutes...");

        $evaluationService->evaluatePeriodically($minutes);

        $this->info("Risk evaluation completed successfully.");
    }
}
