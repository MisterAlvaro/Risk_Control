<?php

namespace Database\Factories;

use App\Domain\Models\Account;
use App\Domain\Models\Trade;
use App\Domain\Models\RiskRule;
use App\Domain\Models\Incident;
use Illuminate\Database\Eloquent\Factories\Factory;

class IncidentFactory extends Factory
{
    protected $model = Incident::class;
    public function definition(): array
    {
        $rule = RiskRule::factory()->create();
        $account = Account::factory()->create();
        $trade = Trade::factory()->create(['account_id' => $account->id]);

        $violationData = match ($rule->type) {
            'duration' => [
                'duration_seconds' => $this->faker->numberBetween(1, 29),
                'min_duration_seconds' => 30,
                'open_time' => $trade->open_time->toISOString(),
                'close_time' => $trade->close_time->toISOString(),
            ],
            'volume_consistency' => [
                'current_volume' => $this->faker->randomFloat(2, 0.01, 10.0),
                'average_volume' => $this->faker->randomFloat(2, 1.0, 2.0),
                'min_factor' => 0.5,
                'max_factor' => 2.0,
                'lookback_trades' => 10,
                'allowed_range' => [
                    'min' => 0.5,
                    'max' => 4.0,
                ],
            ],
            'open_trades_count' => [
                'open_trades_count' => $this->faker->numberBetween(6, 10),
                'time_window_minutes' => 60,
                'max_open_trades' => 5,
                'window_start' => now()->subMinutes(60)->toISOString(),
            ],
        };

        return [
            'account_id' => $account->id,
            'trade_id' => $trade->id,
            'risk_rule_id' => $rule->id,
            'violation_data' => $violationData,
            'status' => $this->faker->randomElement(['pending', 'processed', 'action_executed']),
            'resolved_at' => $this->faker->optional(0.3)->dateTimeBetween('-7 days', 'now'),
        ];
    }
}
