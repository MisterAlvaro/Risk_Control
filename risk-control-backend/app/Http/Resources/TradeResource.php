<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TradeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'account_id' => $this->account_id,
            'account_login' => $this->whenLoaded('account', fn() => $this->account->login),
            'type' => $this->type,
            'volume' => $this->volume,
            'open_time' => $this->open_time->toISOString(),
            'close_time' => $this->close_time?->toISOString(),
            'open_price' => $this->open_price,
            'close_price' => $this->close_price,
            'status' => $this->status,
            'duration_seconds' => $this->getDurationInSeconds(),
            'metadata' => $this->metadata,
            'incidents_count' => $this->whenLoaded('incidents', fn() => $this->incidents->count()),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
