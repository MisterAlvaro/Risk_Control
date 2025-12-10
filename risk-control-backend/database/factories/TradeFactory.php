<?php

namespace Database\Factories;

use App\Domain\Models\Account;
use App\Domain\Models\Trade;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class TradeFactory extends Factory
{
    protected $model = Trade::class;
    public function definition(): array
    {
        $openTime = $this->faker->dateTimeBetween('-30 days', 'now');
        $isClosed = $this->faker->boolean(70);
        $closeTime = $isClosed
            ? Carbon::parse($openTime)->addMinutes($this->faker->numberBetween(1, 1440))
            : null;

        return [
            'account_id' => Account::factory(),
            'type' => $this->faker->randomElement(['BUY', 'SELL']),
            'volume' => $this->faker->randomFloat(2, 0.01, 10.0),
            'open_time' => $openTime,
            'close_time' => $closeTime,
            'open_price' => $this->faker->randomFloat(5, 1.0, 100.0),
            'close_price' => $isClosed
                ? $this->faker->randomFloat(5, $this->faker->numberBetween(80, 120) / 100)
                : null,
            'status' => $isClosed ? 'closed' : 'open',
            'metadata' => [
                'source' => $this->faker->randomElement(['web', 'mobile', 'api']),
                'instrument' => $this->faker->randomElement(['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD']),
            ],
        ];
    }

    public function closed(): Factory
    {
        return $this->state(function (array $attributes) {
            $closeTime = Carbon::parse($attributes['open_time'])->addMinutes($this->faker->numberBetween(1, 1440));

            return [
                'close_time' => $closeTime,
                'close_price' => $this->faker->randomFloat(5, $this->faker->numberBetween(80, 120) / 100),
                'status' => 'closed',
            ];
        });
    }

    public function open(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'close_time' => null,
                'close_price' => null,
                'status' => 'open',
            ];
        });
    }

    public function quickTrade(): Factory
    {
        return $this->state(function (array $attributes) {
            $closeTime = Carbon::parse($attributes['open_time'])->addSeconds($this->faker->numberBetween(1, 30));

            return [
                'close_time' => $closeTime,
                'close_price' => $this->faker->randomFloat(5, $this->faker->numberBetween(99, 101) / 100),
                'status' => 'closed',
            ];
        });
    }
}
