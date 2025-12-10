<?php

namespace App\Rules\Implementations;

use App\Rules\Base\Rule;
use App\Domain\Models\Trade;
use App\Domain\Enums\RuleType;
use Carbon\Carbon;

class OpenTradesCountRule extends Rule
{
    protected string $type = RuleType::OPEN_TRADES_COUNT->value;
    protected string $name = 'Open Trades Count Rule';
    protected string $description = 'Detects abnormal number of open trades in a time window';

    public function evaluate(Trade $trade): bool
    {
        $timeWindow = $this->getParameter('time_window_minutes', 60);
        $minOpenTrades = $this->getParameter('min_open_trades');
        $maxOpenTrades = $this->getParameter('max_open_trades');

        $openTradesCount = $this->countOpenTradesInWindow($trade->account_id, $timeWindow);

        if ($minOpenTrades !== null && $openTradesCount < $minOpenTrades) {
            return true;
        }

        if ($maxOpenTrades !== null && $openTradesCount > $maxOpenTrades) {
            return true;
        }

        return false;
    }

    private function countOpenTradesInWindow(int $accountId, int $timeWindowMinutes): int
    {
        $startTime = Carbon::now()->subMinutes($timeWindowMinutes);

        return Trade::where('account_id', $accountId)
            ->where('status', 'open')
            ->where('open_time', '>=', $startTime)
            ->count();
    }

    public function getViolationData(Trade $trade): array
    {
        $timeWindow = $this->getParameter('time_window_minutes', 60);
        $openTradesCount = $this->countOpenTradesInWindow($trade->account_id, $timeWindow);

        return [
            'open_trades_count' => $openTradesCount,
            'time_window_minutes' => $timeWindow,
            'min_open_trades' => $this->getParameter('min_open_trades'),
            'max_open_trades' => $this->getParameter('max_open_trades'),
            'window_start' => Carbon::now()->subMinutes($timeWindow)->toISOString(),
        ];
    }
}
