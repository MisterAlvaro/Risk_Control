<?php

use App\Domain\Enums\RuleType;
use App\Domain\Enums\SeverityType;
use App\Domain\Enums\ActionType;

if (!function_exists('get_rule_type_label')) {
    function get_rule_type_label(string $type): string
    {
        return match ($type) {
            RuleType::DURATION->value => 'Trade Duration',
            RuleType::VOLUME_CONSISTENCY->value => 'Volume Consistency',
            RuleType::OPEN_TRADES_COUNT->value => 'Open Trades Count',
            default => 'Unknown',
        };
    }
}

if (!function_exists('get_severity_label')) {
    function get_severity_label(string $severity): string
    {
        return match ($severity) {
            SeverityType::HARD->value => 'Hard',
            SeverityType::SOFT->value => 'Soft',
            default => 'Unknown',
        };
    }
}

if (!function_exists('get_action_type_label')) {
    function get_action_type_label(string $type): string
    {
        return match ($type) {
            ActionType::EMAIL->value => 'Email',
            ActionType::SLACK->value => 'Slack',
            ActionType::DISABLE_ACCOUNT->value => 'Disable Account',
            ActionType::DISABLE_TRADING->value => 'Disable Trading',
            default => 'Unknown',
        };
    }
}

if (!function_exists('format_risk_level')) {
    function format_risk_level(int $incidentsCount): array
    {
        if ($incidentsCount >= 5) {
            return ['level' => 'critical', 'color' => 'red'];
        } elseif ($incidentsCount >= 3) {
            return ['level' => 'high', 'color' => 'orange'];
        } elseif ($incidentsCount >= 1) {
            return ['level' => 'medium', 'color' => 'yellow'];
        } else {
            return ['level' => 'low', 'color' => 'green'];
        }
    }
}
