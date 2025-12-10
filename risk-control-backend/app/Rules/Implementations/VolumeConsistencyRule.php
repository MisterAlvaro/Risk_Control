<?php

namespace App\Rules\Implementations;

use App\Rules\Base\Rule;
use App\Domain\Models\Trade;
use App\Domain\Enums\RuleType;
use Illuminate\Support\Facades\DB;

class VolumeConsistencyRule extends Rule
{
    protected string $type = RuleType::VOLUME_CONSISTENCY->value;
    protected string $name = 'Volume Consistency Rule';
    protected string $description = 'Detects abnormal trade volumes compared to historical average';

    public function evaluate(Trade $trade): bool
    {
        $lookbackTrades = $this->getParameter('lookback_trades', 10);
        $minFactor = $this->getParameter('min_factor', 0.5);
        $maxFactor = $this->getParameter('max_factor', 2.0);

        $averageVolume = $this->getAverageVolume($trade->account_id, $lookbackTrades, $trade->id);

        if ($averageVolume === null) {
            return false;
        }

        $currentVolume = (float) $trade->volume;
        $minAllowed = $averageVolume * $minFactor;
        $maxAllowed = $averageVolume * $maxFactor;

        return $currentVolume < $minAllowed || $currentVolume > $maxAllowed;
    }

    private function getAverageVolume(int $accountId, int $lookbackTrades, int $excludeTradeId = null): ?float
    {
        $query = Trade::where('account_id', $accountId)
            ->where('status', 'closed')
            ->where('id', '!=', $excludeTradeId)
            ->orderBy('close_time', 'desc')
            ->limit($lookbackTrades);

        $trades = $query->get();

        if ($trades->isEmpty()) {
            return null;
        }

        return $trades->avg('volume');
    }

    public function getViolationData(Trade $trade): array
    {
        $lookbackTrades = $this->getParameter('lookback_trades', 10);
        $averageVolume = $this->getAverageVolume($trade->account_id, $lookbackTrades, $trade->id);

        return [
            'current_volume' => $trade->volume,
            'average_volume' => $averageVolume,
            'min_factor' => $this->getParameter('min_factor', 0.5),
            'max_factor' => $this->getParameter('max_factor', 2.0),
            'lookback_trades' => $lookbackTrades,
            'allowed_range' => [
                'min' => $averageVolume * $this->getParameter('min_factor', 0.5),
                'max' => $averageVolume * $this->getParameter('max_factor', 2.0),
            ],
        ];
    }
}
