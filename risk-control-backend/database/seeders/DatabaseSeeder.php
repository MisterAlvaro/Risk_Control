<?php

namespace Database\Seeders;

use App\Domain\Models\Account;
use App\Domain\Models\Trade;
use App\Domain\Models\RiskRule;
use App\Domain\Models\RiskAction;
use Illuminate\Database\Seeder;
use Faker\Generator;

class DatabaseSeeder extends Seeder
{
    protected $faker;

    public function __construct(Generator $faker)
    {
        $this->faker = $faker;
    }

    public function run(): void
    {
        // 1. Crear acciones de riesgo predefinidas
        $this->createRiskActions();

        // 2. Crear reglas de riesgo de ejemplo
        $this->createRiskRules();

        // 3. Crear cuentas de trading
        $accounts = Account::factory(15)->create();

        // 4. Crear trades para cada cuenta
        foreach ($accounts as $account) {
            // Trades normales
            Trade::factory()
                ->count($this->faker->numberBetween(5, 20))
                ->create(['account_id' => $account->id]);

            // Algunos trades rápidos para generar incidentes
            if ($this->faker->boolean(30)) {
                Trade::factory()
                    ->quickTrade()
                    ->count($this->faker->numberBetween(1, 3))
                    ->create(['account_id' => $account->id]);
            }
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Accounts: ' . Account::count());
        $this->command->info('Trades: ' . Trade::count());
        $this->command->info('Risk Rules: ' . RiskRule::count());
        $this->command->info('Risk Actions: ' . RiskAction::count());
    }

    private function createRiskActions(): void
    {
        $actions = [
            [
                'name' => 'Send Email Notification',
                'type' => 'email',
                'config' => ['recipient' => 'risk@company.com'],
                'is_active' => true,
            ],
            [
                'name' => 'Send Slack Notification',
                'type' => 'slack',
                'config' => ['webhook_url' => 'https://hooks.slack.com/services/...'],
                'is_active' => true,
            ],
            [
                'name' => 'Disable Trading',
                'type' => 'disable_trading',
                'config' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Disable Account',
                'type' => 'disable_account',
                'config' => null,
                'is_active' => true,
            ],
        ];

        foreach ($actions as $action) {
            RiskAction::create($action);
        }
    }

    private function createRiskRules(): void
    {
        $rules = [
            [
                'name' => 'Quick Trade Detection',
                'description' => 'Detects trades closed in less than 60 seconds',
                'type' => 'duration',
                'parameters' => ['min_duration_seconds' => 60],
                'severity' => 'soft',
                'incidents_before_action' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Volume Anomaly Detection',
                'description' => 'Detects trade volumes outside 50%-200% of historical average',
                'type' => 'volume_consistency',
                'parameters' => [
                    'min_factor' => 0.5,
                    'max_factor' => 2.0,
                    'lookback_trades' => 10,
                ],
                'severity' => 'soft',
                'incidents_before_action' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Concurrent Open Trades Limit',
                'description' => 'Limits concurrent open trades to 5 in 60 minutes',
                'type' => 'open_trades_count',
                'parameters' => [
                    'time_window_minutes' => 60,
                    'max_open_trades' => 5,
                ],
                'severity' => 'hard',
                'incidents_before_action' => null,
                'is_active' => true,
            ],
        ];

        $emailAction = RiskAction::where('type', 'email')->first();
        $slackAction = RiskAction::where('type', 'slack')->first();
        $disableTradingAction = RiskAction::where('type', 'disable_trading')->first();

        foreach ($rules as $ruleData) {
            $rule = RiskRule::create($ruleData);

            // Asignar acciones según el tipo de regla
            if ($rule->type === 'duration') {
                $rule->actions()->attach([
                    $emailAction->id => ['order' => 1],
                    $slackAction->id => ['order' => 2],
                ]);
            } elseif ($rule->severity === 'hard') {
                $rule->actions()->attach([
                    $disableTradingAction->id => ['order' => 1],
                    $emailAction->id => ['order' => 2],
                ]);
            } else {
                $rule->actions()->attach([
                    $emailAction->id => ['order' => 1],
                ]);
            }
        }
    }
}
