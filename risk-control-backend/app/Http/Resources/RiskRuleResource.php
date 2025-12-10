<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Domain\Enums\RuleType;

class RiskRuleResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'type_label' => RuleType::tryFrom($this->type)?->name,
            'parameters' => $this->parameters,
            'severity' => $this->severity,
            'incidents_before_action' => $this->incidents_before_action,
            'is_active' => $this->is_active,
            'actions' => RiskActionResource::collection($this->whenLoaded('actions')),
            'actions_count' => $this->whenLoaded('actions', fn() => $this->actions->count()),
            'incidents_count' => $this->whenLoaded('incidents', fn() => $this->incidents->count()),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
