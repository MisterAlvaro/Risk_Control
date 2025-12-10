<?php

namespace App\Domain\Models;

use Illuminate\Database\Eloquent\Model;

class RiskRuleAction extends Model
{
    protected $table = 'risk_rule_actions';

    protected $fillable = [
        'risk_rule_id',
        'risk_action_id',
        'order',
    ];

    protected $casts = [
        'risk_rule_id' => 'integer',
        'risk_action_id' => 'integer',
        'order' => 'integer',
    ];

    public function riskRule()
    {
        return $this->belongsTo(RiskRule::class);
    }

    public function riskAction()
    {
        return $this->belongsTo(RiskAction::class);
    }
}
