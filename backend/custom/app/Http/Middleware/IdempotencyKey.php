<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class IdempotencyKey
{
    public function handle(Request $request, Closure $next, string $scope = 'default'): Response
    {
        if (! $request->isMethod('post')) {
            return $next($request);
        }

        $key = $request->header('X-Idempotency-Key');
        if (! $key) {
            return response()->json([
                'error' => 'Missing X-Idempotency-Key',
            ], Response::HTTP_PRECONDITION_FAILED);
        }

        $existing = DB::table('idempotency_keys')->where('key', $key)->first();
        if ($existing) {
            return response()->json([
                'status' => 'duplicate',
                'message' => 'Operation already processed',
            ]);
        }

        DB::table('idempotency_keys')->insert([
            'key' => $key,
            'scope' => $scope,
        ]);

        /** @var Response $response */
        $response = $next($request);

        return $response;
    }
}
