<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Models\Account;
use App\Domain\Models\Trade;
use App\Http\Resources\AccountResource;
use App\Http\Resources\TradeResource;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index(Request $request)
    {
        $query = Account::withCount(['trades', 'incidents']);

        if ($request->has('trading_status')) {
            $query->where('trading_status', $request->input('trading_status'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('login')) {
            $query->where('login', 'like', '%' . $request->input('login') . '%');
        }

        $accounts = $query->orderBy('login')->paginate(20);

        return AccountResource::collection($accounts);
    }

    public function show(Account $account)
    {
        $account->load(['trades' => function($query) {
            $query->latest()->limit(10);
        }, 'incidents' => function($query) {
            $query->latest()->limit(10);
        }]);

        return new AccountResource($account);
    }

    public function trades(Account $account)
    {
        $trades = $account->trades()
            ->orderBy('open_time', 'desc')
            ->paginate(20);

        return TradeResource::collection($trades);
    }

    public function riskStatus(Account $account)
    {
        $account->load(['incidents' => function($query) {
            $query->where('status', 'pending')
                  ->with('rule')
                  ->latest();
        }]);

        $activeRules = \App\Domain\Models\RiskRule::where('is_active', true)->get();

        $ruleStatus = [];
        foreach ($activeRules as $rule) {
            $incidentsCount = $account->incidents
                ->where('risk_rule_id', $rule->id)
                ->count();

            $ruleStatus[] = [
                'rule_id' => $rule->id,
                'rule_name' => $rule->name,
                'rule_type' => $rule->type,
                'severity' => $rule->severity,
                'incidents_count' => $incidentsCount,
                'is_violated' => $rule->severity === 'hard'
                    ? $incidentsCount > 0
                    : $incidentsCount >= ($rule->incidents_before_action ?? 1),
            ];
        }

        return response()->json([
            'account' => new AccountResource($account),
            'risk_status' => [
                'total_incidents' => $account->incidents->count(),
                'active_incidents' => $account->incidents->where('status', 'pending')->count(),
                'trading_enabled' => $account->isTradingEnabled(),
                'rule_status' => $ruleStatus,
                'risk_level' => $this->calculateRiskLevel($account),
            ],
        ]);
    }

    private function calculateRiskLevel(Account $account): string
    {
        $activeIncidents = $account->incidents->where('status', 'pending')->count();

        if ($activeIncidents >= 5) {
            return 'critical';
        } elseif ($activeIncidents >= 3) {
            return 'high';
        } elseif ($activeIncidents >= 1) {
            return 'medium';
        } else {
            return 'low';
        }
    }
}
