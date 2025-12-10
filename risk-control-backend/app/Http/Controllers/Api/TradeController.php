<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Domain\Models\Trade;
use App\Http\Resources\TradeResource;
use Illuminate\Http\Request;

class TradeController extends Controller
{
    public function index(Request $request)
    {
        $query = Trade::with(['account', 'incidents']);

        if ($request->has('account_id')) {
            $query->where('account_id', $request->input('account_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('from_date')) {
            $query->where('open_time', '>=', $request->input('from_date'));
        }

        if ($request->has('to_date')) {
            $query->where('open_time', '<=', $request->input('to_date'));
        }

        if ($request->has('min_volume')) {
            $query->where('volume', '>=', $request->input('min_volume'));
        }

        if ($request->has('max_volume')) {
            $query->where('volume', '<=', $request->input('max_volume'));
        }

        $trades = $query->orderBy('open_time', 'desc')->paginate(30);

        return TradeResource::collection($trades);
    }

    public function show(Trade $trade)
    {
        $trade->load(['account', 'incidents.rule']);

        return new TradeResource($trade);
    }
}
