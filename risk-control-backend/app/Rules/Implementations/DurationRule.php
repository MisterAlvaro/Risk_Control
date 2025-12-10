<?php

namespace App\Rules\Implementations;

use App\Rules\Base\Rule;
use App\Domain\Models\Trade;
use App\Domain\Enums\RuleType;

class DurationRule extends Rule
{
    protected string $type = RuleType::DURATION->value;
    protected string $name = 'Trade Duration Rule';
    protected string $description = 'Detects trades closed too quickly';

    public function evaluate(Trade $trade): bool
    {
        if (!$trade->isClosed()) {
            return false;
        }

        $duration = $trade->getDurationInSeconds();
        $minDuration = $this->getParameter('min_duration_seconds');

        if ($duration === null || $minDuration === null) {
            return false;
        }

        return $duration < $minDuration;
    }

    public function getViolationData(Trade $trade): array
    {
        return [
            'duration_seconds' => $trade->getDurationInSeconds(),
            'min_duration_seconds' => $this->getParameter('min_duration_seconds'),
            'open_time' => $trade->open_time->toISOString(),
            'close_time' => $trade->close_time->toISOString(),
        ];
    }
}
