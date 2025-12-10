<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Domain\Models\Account;

class AccountFactory extends Factory
{
    protected $model = Account::class;

    public function definition(): array
    {
        return [
            'login' => $this->faker->unique()->numberBetween(100000, 999999),
            'trading_status' => $this->faker->randomElement(['enable', 'disable']),
            'status' => $this->faker->randomElement(['enable', 'disable']),
        ];
    }

    public function enabled(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'trading_status' => 'enable',
                'status' => 'enable',
            ];
        });
    }

    public function disabled(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'trading_status' => 'disable',
                'status' => 'disable',
            ];
        });
    }
}
