<?php

namespace App\Domain\Models;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Events\TradeClosed;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Trade extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'type',
        'volume',
        'open_time',
        'close_time',
        'open_price',
        'close_price',
        'status',
        'metadata',
    ];

    protected $casts = [
        'open_time' => 'datetime',
        'close_time' => 'datetime',
        'open_price' => 'decimal:5',
        'close_price' => 'decimal:5',
        'volume' => 'decimal:2',
        'metadata' => 'array',
        'type' => 'string',
        'status' => 'string',
    ];

    protected static function booted()
    {
        static::updated(function ($trade) {
            if ($trade->isDirty('status') && $trade->status === 'closed') {
                event(new TradeClosed($trade));
            }
        });
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }

    public function getDurationInSeconds(): ?int
    {
        if (!$this->close_time) {
            return null;
        }

        return $this->open_time->diffInSeconds($this->close_time);
    }

    public function isClosed(): bool
    {
        return $this->status === 'closed';
    }
    public static function newFactory()
    {
        return \Database\Factories\TradeFactory::new();
    }
}
