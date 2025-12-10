<?php

namespace App\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RiskAction extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'type',
        'config',
        'is_active',
    ];

    protected $casts = [
        'config' => 'array',
        'is_active' => 'boolean',
    ];

    public function rules()
    {
        return $this->belongsToMany(RiskRule::class, 'risk_rule_actions')
                    ->withPivot('order')
                    ->withTimestamps();
    }

    public static function newFactory()
    {
        return \Database\Factories\RiskActionFactory::new();
    }
}
