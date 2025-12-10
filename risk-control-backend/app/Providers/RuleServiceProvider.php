<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Application\Services\RuleEvaluationService;

class RuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(RuleEvaluationService::class, function ($app) {
            return new RuleEvaluationService();
        });
    }

    public function boot(): void
    {
        $this->app->bind('available-rule-types', function () {
            return [
                [
                    'value' => 'duration',
                    'label' => 'Trade Duration',
                    'description' => 'Detects trades closed too quickly',
                    'parameters' => [
                        [
                            'name' => 'min_duration_seconds',
                            'label' => 'Minimum Duration (seconds)',
                            'type' => 'number',
                            'required' => true,
                            'min' => 1,
                        ],
                    ],
                ],
                [
                    'value' => 'volume_consistency',
                    'label' => 'Volume Consistency',
                    'description' => 'Detects abnormal trade volumes',
                    'parameters' => [
                        [
                            'name' => 'min_factor',
                            'label' => 'Minimum Factor',
                            'type' => 'number',
                            'required' => true,
                            'min' => 0,
                            'max' => 1,
                            'step' => 0.1,
                        ],
                        [
                            'name' => 'max_factor',
                            'label' => 'Maximum Factor',
                            'type' => 'number',
                            'required' => true,
                            'min' => 1,
                            'max' => 10,
                            'step' => 0.1,
                        ],
                        [
                            'name' => 'lookback_trades',
                            'label' => 'Lookback Trades',
                            'type' => 'number',
                            'required' => true,
                            'min' => 1,
                            'max' => 100,
                        ],
                    ],
                ],
                [
                    'value' => 'open_trades_count',
                    'label' => 'Open Trades Count',
                    'description' => 'Limits concurrent open trades',
                    'parameters' => [
                        [
                            'name' => 'time_window_minutes',
                            'label' => 'Time Window (minutes)',
                            'type' => 'number',
                            'required' => true,
                            'min' => 1,
                            'max' => 1440,
                        ],
                        [
                            'name' => 'min_open_trades',
                            'label' => 'Minimum Open Trades (optional)',
                            'type' => 'number',
                            'required' => false,
                            'min' => 0,
                        ],
                        [
                            'name' => 'max_open_trades',
                            'label' => 'Maximum Open Trades (optional)',
                            'type' => 'number',
                            'required' => false,
                            'min' => 1,
                        ],
                    ],
                ],
            ];
        });
    }
}
