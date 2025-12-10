<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RiskRuleController;
use App\Http\Controllers\Api\IncidentController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\ActionController;
use App\Http\Controllers\Api\TradeController;

Route::prefix('v1')->group(function () {
    // Risk Rules CRUD
    Route::apiResource('risk-rules', RiskRuleController::class);
    Route::post('risk-rules/{riskRule}/actions/{action}', [RiskRuleController::class, 'attachAction']);
    Route::delete('risk-rules/{riskRule}/actions/{action}', [RiskRuleController::class, 'detachAction']);
    Route::put('risk-rules/{riskRule}/actions/order', [RiskRuleController::class, 'updateActionsOrder']);

    // Incidents
    Route::get('incidents', [IncidentController::class, 'index']);
    Route::get('incidents/{incident}', [IncidentController::class, 'show']);
    Route::get('accounts/{account}/incidents', [IncidentController::class, 'byAccount']);
    Route::get('risk-rules/{riskRule}/incidents', [IncidentController::class, 'byRule']);
    Route::post('incidents/{incident}/resolve', [IncidentController::class, 'resolve']);

    // Accounts
    Route::get('accounts', [AccountController::class, 'index']);
    Route::get('accounts/{account}', [AccountController::class, 'show']);
    Route::get('accounts/{account}/risk-status', [AccountController::class, 'riskStatus']);
    Route::get('accounts/{account}/trades', [AccountController::class, 'trades']);

    // Actions
    Route::get('actions', [ActionController::class, 'index']);

    // Trades
    Route::get('trades', [TradeController::class, 'index']);
    Route::get('trades/{trade}', [TradeController::class, 'show']);
});
