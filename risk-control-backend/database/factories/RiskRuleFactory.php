<?php

namespace Database\Factories;

use App\Domain\Enums\RuleType;
use App\Domain\Enums\SeverityType;
use App\Domain\Models\RiskRule;
use Illuminate\Database\Eloquent\Factories\Factory;

class RiskRuleFactory extends Factory
{
    protected $model = RiskRule::class;
    public function definition(): array
    {
        $type = $this->faker->randomElement(RuleType::cases());

        $parameters = match ($type) {
            RuleType::DURATION => [
                'min_duration_seconds' => $this->faker->numberBetween(30, 300),
            ],
            RuleType::VOLUME_CONSISTENCY => [
                'min_factor' => $this->faker->randomFloat(2, 0.3, 0.7),
                'max_factor' => $this->faker->randomFloat(2, 1.5, 3.0),
                'lookback_trades' => $this->faker->numberBetween(5, 20),
            ],
            RuleType::OPEN_TRADES_COUNT => [
                'time_window_minutes' => $this->faker->numberBetween(30, 240),
                'max_open_trades' => $this->faker->numberBetween(3, 10),
            ],
        };

        $severity = $this->faker->randomElement(SeverityType::cases());

        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'type' => $type->value,
            'parameters' => $parameters,
            'severity' => $severity->value,
            'incidents_before_action' => $severity === SeverityType::SOFT
                ? $this->faker->numberBetween(2, 5)
                : null,
            'is_active' => $this->faker->boolean(80),
        ];
    }

    public function durationRule(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => RuleType::DURATION->value,
                'parameters' => [
                    'min_duration_seconds' => $this->faker->numberBetween(30, 120),
                ],
            ];
        });
    }

    public function volumeConsistencyRule(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => RuleType::VOLUME_CONSISTENCY->value,
                'parameters' => [
                    'min_factor' => 0.5,
                    'max_factor' => 2.0,
                    'lookback_trades' => 10,
                ],
            ];
        });
    }

    public function openTradesCountRule(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => RuleType::OPEN_TRADES_COUNT->value,
                'parameters' => [
                    'time_window_minutes' => 60,
                    'max_open_trades' => 5,
                ],
            ];
        });
    }
}
