<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApiController extends Controller
{
    /**
     * Health check endpoint
     */
    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'Joonik API is running',
            'timestamp' => now()->toISOString(),
            'version' => '1.0.0'
        ]);
    }

    /**
     * Authentication endpoint
     */
    public function auth(Request $request): JsonResponse
    {
        $apiKey = $request->header('X-API-Key');
        $expectedApiKey = config('app.api_key', 'joonik-secret-api-key-2024');

        if (!$apiKey || $apiKey !== $expectedApiKey) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or missing API key'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Authentication successful',
            'authenticated' => true
        ]);
    }
}
