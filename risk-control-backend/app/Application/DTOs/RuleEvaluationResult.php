<?php

namespace App\Application\DTOs;

use App\Domain\Models\RiskRule;
use App\Domain\Models\Trade;

class RuleEvaluationResult
{
    public function __construct(
        public RiskRule $rule,
        public bool $isViolated,
        public array $violationData,
        public ?Trade $trade = null
    ) {}
}
