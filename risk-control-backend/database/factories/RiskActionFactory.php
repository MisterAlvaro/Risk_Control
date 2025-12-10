<?php

namespace Database\Factories;

use App\Domain\Models\RiskAction;
use Illuminate\Database\Eloquent\Factories\Factory;

class RiskActionFactory extends Factory
{
    protected $model = RiskAction::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'type' => $this->faker->randomElement(['email', 'slack', 'disable_trading', 'disable_account']),
            'config' => null,
            'is_active' => $this->faker->boolean(90),
        ];
    }

    public function email(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'email',
                'config' => ['recipient' => $this->faker->email()],
            ];
        });
    }

    public function slack(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'slack',
                'config' => ['webhook_url' => $this->faker->url()],
            ];
        });
    }

    public function disableTrading(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'disable_trading',
                'config' => null,
            ];
        });
    }

    public function disableAccount(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'disable_account',
                'config' => null,
            ];
        });
    }
}
