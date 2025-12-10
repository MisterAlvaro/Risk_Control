<?php

namespace App\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Account extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'login',
        'trading_status',
        'status',
    ];

    protected $casts = [
        'trading_status' => 'string',
        'status' => 'string',
    ];

    public function trades()
    {
        return $this->hasMany(Trade::class);
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }

    public function isTradingEnabled(): bool
    {
        return $this->trading_status === 'enable' && $this->status === 'enable';
    }

    public function disableTrading(): void
    {
        $this->update(['trading_status' => 'disable']);
    }

    public function disableAccount(): void
    {
        $this->update(['status' => 'disable']);
    }

    public function getActiveIncidentsCount(): int
    {
        return $this->incidents()
            ->where('status', 'pending')
            ->count();
    }

    public static function newFactory()
    {
        return \Database\Factories\AccountFactory::new();
    }
}
