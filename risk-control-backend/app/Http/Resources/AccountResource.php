<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'login' => $this->login,
            'trading_status' => $this->trading_status,
            'status' => $this->status,
            'is_trading_enabled' => $this->isTradingEnabled(),
            'trades_count' => $this->whenLoaded('trades', fn() => $this->trades->count()),
            'open_trades_count' => $this->whenLoaded('trades', function() {
                return $this->trades->where('status', 'open')->count();
            }),
            'incidents_count' => $this->whenLoaded('incidents', fn() => $this->incidents->count()),
            'active_incidents_count' => $this->whenLoaded('incidents', function() {
                return $this->incidents->where('status', 'pending')->count();
            }),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
