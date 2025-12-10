<?php

namespace App\Rules\Base;

use App\Application\Interfaces\RuleInterface;
use App\Domain\Models\Trade;

abstract class Rule implements RuleInterface
{
    protected array $parameters = [];
    protected string $type;
    protected string $name;
    protected string $description;

    public function __construct(array $parameters = [])
    {
        $this->parameters = $parameters;
    }

    abstract public function evaluate(Trade $trade): bool;

    abstract public function getViolationData(Trade $trade): array;

    public function getType(): string
    {
        return $this->type;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getParameters(): array
    {
        return $this->parameters;
    }

    protected function getParameter(string $key, $default = null)
    {
        return $this->parameters[$key] ?? $default;
    }
}
