<?php

namespace App\Domain\Enums;

enum RuleType: string
{
    case DURATION = 'duration';
    case VOLUME_CONSISTENCY = 'volume_consistency';
    case OPEN_TRADES_COUNT = 'open_trades_count';
}
