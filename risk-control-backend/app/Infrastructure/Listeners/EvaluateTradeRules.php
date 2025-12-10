<?php

namespace App\Infrastructure\Listeners;

use App\Domain\Events\TradeClosed;
use App\Application\Services\RuleEvaluationService;
use Illuminate\Contracts\Queue\ShouldQueue;

class EvaluateTradeRules implements ShouldQueue
{
    public function __construct(
        private RuleEvaluationService $evaluationService
    ) {}

    public function handle(TradeClosed $event): void
    {
        $this->evaluationService->evaluateTrade($event->trade);
    }
}
