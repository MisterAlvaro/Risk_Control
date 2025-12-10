<?php

namespace App\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RiskRule extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'type',
        'parameters',
        'severity',
        'incidents_before_action',
        'is_active',
    ];

    protected $casts = [
        'parameters' => 'array',
        'is_active' => 'boolean',
    ];

    public function actions()
    {
        return $this->belongsToMany(RiskAction::class, 'risk_rule_actions')
                    ->withPivot('order')
                    ->withTimestamps()
                    ->orderBy('order');
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }

    public function getActiveActions()
    {
        return $this->actions()->where('is_active', true)->get();
    }

    public static function newFactory()
    {
        return \Database\Factories\RiskRuleFactory::new();
    }
}
