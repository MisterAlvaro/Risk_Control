<?php

namespace App\Domain\Enums;

enum ActionType: string
{
    case EMAIL = 'email';
    case SLACK = 'slack';
    case DISABLE_ACCOUNT = 'disable_account';
    case DISABLE_TRADING = 'disable_trading';
}
