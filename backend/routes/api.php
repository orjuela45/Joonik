<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\LocationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoint (no API key required)
Route::get('/v1/health', [ApiController::class, 'health']);

// API routes with API key middleware
Route::middleware(['api.key'])->prefix('v1')->group(function () {
    // Authentication
    Route::post('/auth', [ApiController::class, 'auth']);
    
    // Locations CRUD
    Route::apiResource('locations', LocationController::class);
});