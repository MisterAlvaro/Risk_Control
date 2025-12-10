<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class IncidentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'account_id' => $this->account_id,
            'account_login' => $this->whenLoaded('account', fn() => $this->account->login),
            'trade_id' => $this->trade_id,
            'trade_volume' => $this->whenLoaded('trade', fn() => $this->trade->volume),
            'risk_rule_id' => $this->risk_rule_id,
            'rule_name' => $this->whenLoaded('rule', fn() => $this->rule->name),
            'violation_data' => $this->violation_data,
            'status' => $this->status,
            'resolved_at' => $this->resolved_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
