<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Models\RiskRule;
use App\Domain\Models\RiskAction;
use App\Http\Requests\StoreRiskRuleRequest;
use App\Http\Requests\UpdateRiskRuleRequest;
use App\Http\Resources\RiskRuleResource;
use Illuminate\Http\Request;

class RiskRuleController extends Controller
{
    public function index(Request $request)
    {
        $query = RiskRule::with('actions');

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('severity')) {
            $query->where('severity', $request->input('severity'));
        }

        $rules = $query->orderBy('created_at', 'desc')->paginate(20);

        return RiskRuleResource::collection($rules);
    }

    public function store(StoreRiskRuleRequest $request)
    {
        $validated = $request->validated();

        $rule = RiskRule::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'parameters' => $validated['parameters'],
            'severity' => $validated['severity'],
            'incidents_before_action' => $validated['severity'] === 'soft'
                ? ($validated['incidents_before_action'] ?? 3)
                : null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return new RiskRuleResource($rule->load('actions'));
    }

    public function show(RiskRule $riskRule)
    {
        $riskRule->load(['actions', 'incidents' => function($query) {
            $query->latest()->limit(10);
        }]);

        return new RiskRuleResource($riskRule);
    }

    public function update(UpdateRiskRuleRequest $request, RiskRule $riskRule)
    {
        $validated = $request->validated();

        $updateData = [];

        if (isset($validated['name'])) {
            $updateData['name'] = $validated['name'];
        }

        if (isset($validated['description'])) {
            $updateData['description'] = $validated['description'];
        }

        if (isset($validated['parameters'])) {
            $updateData['parameters'] = $validated['parameters'];
        }

        if (isset($validated['severity'])) {
            $updateData['severity'] = $validated['severity'];
            $updateData['incidents_before_action'] = $validated['severity'] === 'soft'
                ? ($validated['incidents_before_action'] ?? 3)
                : null;
        } elseif (isset($validated['incidents_before_action']) && $riskRule->severity === 'soft') {
            $updateData['incidents_before_action'] = $validated['incidents_before_action'];
        }

        if (isset($validated['is_active'])) {
            $updateData['is_active'] = $validated['is_active'];
        }

        $riskRule->update($updateData);

        return new RiskRuleResource($riskRule->fresh()->load('actions'));
    }

    public function destroy(RiskRule $riskRule)
    {
        $riskRule->delete();

        return response()->json([
            'message' => 'Risk rule deleted successfully',
        ], 204);
    }

    public function attachAction(RiskRule $riskRule, RiskAction $action)
    {
        if (!$riskRule->actions()->where('risk_action_id', $action->id)->exists()) {
            // Obtener el siguiente order disponible
            $maxOrder = $riskRule->actions()->max('order') ?? 0;

            $riskRule->actions()->attach($action->id, [
                'order' => $maxOrder + 1,
            ]);
        }

        return response()->json([
            'message' => 'Action attached to rule successfully',
            'rule' => new RiskRuleResource($riskRule->fresh()->load('actions')),
        ]);
    }

    public function detachAction(RiskRule $riskRule, RiskAction $action)
    {
        $riskRule->actions()->detach($action->id);

        // Reordenar las acciones restantes
        $this->reorderActions($riskRule);

        return response()->json([
            'message' => 'Action detached from rule successfully',
            'rule' => new RiskRuleResource($riskRule->fresh()->load('actions')),
        ]);
    }

    public function updateActionsOrder(Request $request, RiskRule $riskRule)
    {
        $request->validate([
            'actions' => 'required|array',
            'actions.*.id' => 'required|exists:risk_actions,id',
            'actions.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->actions as $action) {
            $riskRule->actions()->updateExistingPivot($action['id'], [
                'order' => $action['order'],
            ]);
        }

        return response()->json([
            'message' => 'Actions order updated successfully',
            'rule' => new RiskRuleResource($riskRule->fresh()->load('actions')),
        ]);
    }

    private function reorderActions(RiskRule $riskRule): void
    {
        $actions = $riskRule->actions()->orderBy('order')->get();

        $order = 0;
        foreach ($actions as $action) {
            $riskRule->actions()->updateExistingPivot($action->id, [
                'order' => $order++,
            ]);
        }
    }
}
