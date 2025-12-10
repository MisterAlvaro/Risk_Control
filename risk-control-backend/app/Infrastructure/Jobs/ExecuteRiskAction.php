<?php

namespace App\Infrastructure\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Domain\Models\RiskAction;
use App\Domain\Models\Account;
use App\Domain\Models\Trade;
use Illuminate\Support\Facades\Log;

class ExecuteRiskAction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private RiskAction $action,
        private Account $account,
        private ?Trade $trade = null
    ) {}

    public function handle(): void
    {
        try {
            switch ($this->action->type) {
                case 'email':
                    $this->sendEmail();
                    break;
                case 'slack':
                    $this->sendSlack();
                    break;
                case 'disable_account':
                    $this->disableAccount();
                    break;
                case 'disable_trading':
                    $this->disableTrading();
                    break;
            }

            $this->logExecution('success');
        } catch (\Exception $e) {
            $this->logExecution('failed', $e->getMessage());

            if ($this->attempts() < 3) {
                $this->release(60);
            }
        }
    }

    private function sendEmail(): void
    {
        Log::info("Email notification sent", [
            'account_id' => $this->account->id,
            'account_login' => $this->account->login,
            'action_id' => $this->action->id,
            'trade_id' => $this->trade?->id,
        ]);
    }

    private function sendSlack(): void
    {
        Log::info("Slack notification sent", [
            'account_id' => $this->account->id,
            'account_login' => $this->account->login,
            'action_id' => $this->action->id,
            'trade_id' => $this->trade?->id,
        ]);
    }

    private function disableAccount(): void
    {
        $this->account->disableAccount();
        Log::warning("Account disabled by risk action", [
            'account_id' => $this->account->id,
            'account_login' => $this->account->login,
            'action_id' => $this->action->id,
        ]);
    }

    private function disableTrading(): void
    {
        $this->account->disableTrading();
        Log::warning("Trading disabled by risk action", [
            'account_id' => $this->account->id,
            'account_login' => $this->account->login,
            'action_id' => $this->action->id,
        ]);
    }

    private function logExecution(string $status, ?string $error = null): void
    {
        $logData = [
            'action_type' => $this->action->type,
            'action_id' => $this->action->id,
            'account_id' => $this->account->id,
            'account_login' => $this->account->login,
            'trade_id' => $this->trade?->id,
            'status' => $status,
            'executed_at' => now()->toISOString(),
        ];

        if ($status === 'success') {
            Log::info("Risk action executed successfully", $logData);
        } else {
            Log::error("Risk action failed", array_merge($logData, ['error' => $error]));
        }
    }
}
