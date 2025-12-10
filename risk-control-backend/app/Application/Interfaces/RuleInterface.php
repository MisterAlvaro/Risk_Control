<?php

namespace App\Application\Interfaces;

use App\Domain\Models\Trade;

interface RuleInterface
{
    public function evaluate(Trade $trade): bool;
    public function getType(): string;
    public function getName(): string;
    public function getDescription(): string;
    public function getParameters(): array;
    public function getViolationData(Trade $trade): array;
}
