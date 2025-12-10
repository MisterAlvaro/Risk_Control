<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Domain\Enums\RuleType;
use App\Domain\Enums\SeverityType;

class StoreRiskRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $baseRules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:' . implode(',', array_column(RuleType::cases(), 'value')),
            'parameters' => 'required|array',
            'severity' => 'required|in:' . implode(',', array_column(SeverityType::cases(), 'value')),
            'is_active' => 'boolean',
        ];

        // Reglas específicas para soft rules
        if ($this->input('severity') === 'soft') {
            $baseRules['incidents_before_action'] = 'required|integer|min:1|max:100';
        }

        // Validaciones específicas por tipo de regla
        $type = $this->input('type');
        if ($type) {
            switch ($type) {
                case RuleType::DURATION->value:
                    $baseRules['parameters.min_duration_seconds'] = 'required|integer|min:1';
                    break;

                case RuleType::VOLUME_CONSISTENCY->value:
                    $baseRules['parameters.min_factor'] = 'required|numeric|min:0|max:1';
                    $baseRules['parameters.max_factor'] = 'required|numeric|min:1|max:10';
                    $baseRules['parameters.lookback_trades'] = 'required|integer|min:1|max:100';
                    break;

                case RuleType::OPEN_TRADES_COUNT->value:
                    $baseRules['parameters.time_window_minutes'] = 'required|integer|min:1|max:1440';
                    if (isset($this->parameters['min_open_trades'])) {
                        $baseRules['parameters.min_open_trades'] = 'integer|min:0';
                    }
                    if (isset($this->parameters['max_open_trades'])) {
                        $baseRules['parameters.max_open_trades'] = 'integer|min:1';
                    }
                    break;
            }
        }

        return $baseRules;
    }

    public function messages(): array
    {
        return [
            'type.in' => 'El tipo de regla debe ser uno de: ' .
                implode(', ', array_map(fn($case) => $case->value, RuleType::cases())),
            'severity.in' => 'La severidad debe ser: hard o soft',
            'parameters.required' => 'Los parámetros son requeridos para este tipo de regla',
        ];
    }
}
