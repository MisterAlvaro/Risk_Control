<?php

namespace App\Application\Services;

use App\Domain\Models\Trade;
use App\Domain\Models\RiskRule;
use App\Domain\Models\Incident;
use App\Rules\RuleFactory;
use App\Application\DTOs\RuleEvaluationResult;
use App\Application\Interfaces\RuleInterface;
use App\Infrastructure\Jobs\ExecuteRiskAction;
use Illuminate\Support\Facades\Log;

class RuleEvaluationService
{
    public function evaluateTrade(Trade $trade): array
    {
        $results = [];

        $activeRules = RiskRule::where('is_active', true)->get();

        foreach ($activeRules as $ruleModel) {
            try {
                /** @var RuleInterface $rule */
                $rule = RuleFactory::createFromRuleModel($ruleModel);
                $isViolated = $rule->evaluate($trade);

                if ($isViolated) {
                    $violationData = $rule->getViolationData($trade);

                    $results[] = new RuleEvaluationResult(
                        rule: $ruleModel,
                        isViolated: true,
                        violationData: $violationData,
                        trade: $trade
                    );

                    $this->createIncident($ruleModel, $trade, $violationData);
                    $this->evaluateAndExecuteActions($ruleModel, $trade);
                }
            } catch (\Exception $e) {
                Log::error("Error evaluating rule {$ruleModel->id}: " . $e->getMessage());
            }
        }

        return $results;
    }

    private function createIncident(RiskRule $rule, Trade $trade, array $violationData): void
    {
        Incident::create([
            'account_id' => $trade->account_id,
            'trade_id' => $trade->id,
            'risk_rule_id' => $rule->id,
            'violation_data' => $violationData,
            'status' => 'pending',
        ]);
    }

    private function evaluateAndExecuteActions(RiskRule $rule, Trade $trade): void
    {
        if ($rule->severity === 'hard') {
            $this->executeActions($rule, $trade);
        } else {
            $incidentsCount = Incident::where('account_id', $trade->account_id)
                ->where('risk_rule_id', $rule->id)
                ->where('created_at', '>=', now()->subHours(24))
                ->count();

            if ($incidentsCount >= $rule->incidents_before_action) {
                $this->executeActions($rule, $trade);
            }
        }
    }

    private function executeActions(RiskRule $rule, Trade $trade): void
    {
        $actions = $rule->getActiveActions();

        foreach ($actions as $action) {
            ExecuteRiskAction::dispatch($action, $trade->account, $trade);
        }
    }

    public function evaluatePeriodically(int $minutes = 5): void
    {
        $fromTime = now()->subMinutes($minutes);

        $trades = Trade::where('status', 'closed')
            ->where('close_time', '>=', $fromTime)
            ->where('close_time', '<=', now())
            ->with('account')
            ->get();

        foreach ($trades as $trade) {
            $this->evaluateTrade($trade);
        }
    }
}
