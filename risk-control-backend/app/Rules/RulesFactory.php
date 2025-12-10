<?php

namespace App\Rules;

use App\Rules\Implementations\DurationRule;
use App\Rules\Implementations\VolumeConsistencyRule;
use App\Rules\Implementations\OpenTradesCountRule;
use App\Domain\Enums\RuleType;
use App\Domain\Models\RiskRule;

class RuleFactory
{
    public static function create(string $type, array $parameters = []): \App\Application\Interfaces\RuleInterface
    {
        return match ($type) {
            RuleType::DURATION->value => new DurationRule($parameters),
            RuleType::VOLUME_CONSISTENCY->value => new VolumeConsistencyRule($parameters),
            RuleType::OPEN_TRADES_COUNT->value => new OpenTradesCountRule($parameters),
            default => throw new \InvalidArgumentException("Unknown rule type: {$type}"),
        };
    }

    public static function createFromRuleModel(RiskRule $ruleModel): \App\Application\Interfaces\RuleInterface
    {
        return self::create($ruleModel->type, $ruleModel->parameters);
    }
}
