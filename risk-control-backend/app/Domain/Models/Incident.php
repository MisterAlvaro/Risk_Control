<?php

namespace App\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'trade_id',
        'risk_rule_id',
        'violation_data',
        'status',
        'resolved_at',
    ];

    protected $casts = [
        'violation_data' => 'array',
        'resolved_at' => 'datetime',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function trade()
    {
        return $this->belongsTo(Trade::class);
    }

    public function rule()
    {
        return $this->belongsTo(RiskRule::class, 'risk_rule_id');
    }

    public function markAsProcessed(): void
    {
        $this->update(['status' => 'processed']);
    }

    public function markAsActionExecuted(): void
    {
        $this->update([
            'status' => 'action_executed',
            'resolved_at' => now(),
        ]);
    }

    public static function newFactory()
    {
        return \Database\Factories\IncidentFactory::new();
    }
}
