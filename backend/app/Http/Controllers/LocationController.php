<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Http\Controllers\Controller;
use App\Http\Requests\LocationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $locations = Location::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $locations,
                'message' => 'Locations retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving locations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(LocationRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $location = Location::create($validated);

            return response()->json([
                'success' => true,
                'data' => $location,
                'message' => 'Location created successfully'
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating location',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $location,
                'message' => 'Location retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving location',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(LocationRequest $request, Location $location): JsonResponse
    {
        try {
            $validated = $request->validated();

            $location->update($validated);

            return response()->json([
                'success' => true,
                'data' => $location->fresh(),
                'message' => 'Location updated successfully'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating location',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location): JsonResponse
    {
        try {
            $location->delete();

            return response()->json([
                'success' => true,
                'message' => 'Location deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting location',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
