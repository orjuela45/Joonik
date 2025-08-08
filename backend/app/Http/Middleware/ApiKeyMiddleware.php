<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip API key validation for health check endpoint
        if ($request->is('api/v1/health')) {
            return $next($request);
        }

        $apiKey = $request->header('X-API-Key');
        $expectedApiKey = config('app.api_key', 'joonik-secret-api-key-2024');

        if (!$apiKey || $apiKey !== $expectedApiKey) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Invalid or missing API key'
            ], 401);
        }

        return $next($request);
    }
}
