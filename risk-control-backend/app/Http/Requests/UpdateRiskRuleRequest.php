<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRiskRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'parameters' => 'sometimes|array',
            'severity' => 'sometimes|in:hard,soft',
            'incidents_before_action' => 'required_if:severity,soft|integer|min:1|max:100',
            'is_active' => 'sometimes|boolean',
        ];
    }
}
