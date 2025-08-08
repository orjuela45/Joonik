<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Http\Controllers\Controller;
use App\Http\Requests\LocationRequest;
use App\Http\Resources\LocationResource;
use App\Http\Resources\LocationCollection;
use App\Services\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LocationController extends Controller
{
    public function __construct(
        private LocationService $locationService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['name', 'code']);
            $perPage = $request->get('per_page', 15);
            
            $locations = $this->locationService->getPaginatedLocations($filters, $perPage);

            return (new LocationCollection($locations))->response();
        } catch (\Exception $e) {
            return $this->errorResponse('Error retrieving locations', 'E_RETRIEVAL_ERROR', $e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(LocationRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $location = $this->locationService->createLocation($validated);

            return (new LocationResource($location))
                ->additional([
                    'success' => true,
                    'message' => 'Location created successfully'
                ])
                ->response()
                ->setStatusCode(201);
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error creating location', 'E_CREATION_ERROR', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location): JsonResponse
    {
        try {
            return (new LocationResource($location))
                ->additional([
                    'success' => true,
                    'message' => 'Location retrieved successfully'
                ])
                ->response();
        } catch (\Exception $e) {
            return $this->errorResponse('Error retrieving location', 'E_RETRIEVAL_ERROR', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(LocationRequest $request, Location $location): JsonResponse
    {
        try {
            $validated = $request->validated();

            $updatedLocation = $this->locationService->updateLocation($location, $validated);

            return (new LocationResource($updatedLocation))
                ->additional([
                    'success' => true,
                    'message' => 'Location updated successfully'
                ])
                ->response();
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('Error updating location', 'E_UPDATE_ERROR', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location): JsonResponse
    {
        try {
            $this->locationService->deleteLocation($location);

            return response()->json([
                'success' => true,
                'message' => 'Location deleted successfully'
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Error deleting location', 'E_DELETION_ERROR', $e->getMessage());
        }
    }

    /**
     * Return a standardized error response.
     */
    private function errorResponse(string $message, string $code, string $details = null): JsonResponse
    {
        $response = [
            'success' => false,
            'error' => [
                'message' => $message,
                'code' => $code
            ]
        ];

        if ($details && config('app.debug')) {
            $response['error']['details'] = $details;
        }

        return response()->json($response, 500);
    }

    /**
     * Return a standardized validation error response.
     */
    private function validationErrorResponse(array $errors): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => [
                'message' => 'Validation failed',
                'code' => 'E_INVALID_PARAM',
                'details' => $errors
            ]
        ], 422);
    }
}
