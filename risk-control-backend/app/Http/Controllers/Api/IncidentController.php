<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Models\Incident;
use App\Domain\Models\Account;
use App\Domain\Models\RiskRule;
use App\Http\Resources\IncidentResource;
use Illuminate\Http\Request;

class IncidentController extends Controller
{
    public function index(Request $request)
    {
        $query = Incident::with(['account', 'trade', 'rule']);

        if ($request->has('account_id')) {
            $query->where('account_id', $request->input('account_id'));
        }

        if ($request->has('risk_rule_id')) {
            $query->where('risk_rule_id', $request->input('risk_rule_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('from_date')) {
            $query->where('created_at', '>=', $request->input('from_date'));
        }

        if ($request->has('to_date')) {
            $query->where('created_at', '<=', $request->input('to_date'));
        }

        if ($request->has('trade_id')) {
            $query->where('trade_id', $request->input('trade_id'));
        }

        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $incidents = $query->paginate(30);

        return IncidentResource::collection($incidents);
    }

    public function show(Incident $incident)
    {
        $incident->load(['account', 'trade', 'rule']);

        return new IncidentResource($incident);
    }

    public function byAccount(Account $account)
    {
        $incidents = $account->incidents()
            ->with(['trade', 'rule'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return IncidentResource::collection($incidents);
    }

    public function byRule(RiskRule $riskRule)
    {
        $incidents = $riskRule->incidents()
            ->with(['account', 'trade'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return IncidentResource::collection($incidents);
    }

    public function resolve(Incident $incident)
    {
        $incident->markAsProcessed();

        return response()->json([
            'message' => 'Incident resolved successfully',
            'incident' => new IncidentResource($incident->fresh()->load(['account', 'trade', 'rule'])),
        ]);
    }
}
