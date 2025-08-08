<?php

namespace App\Services;

use App\Models\Location;
use App\Repositories\LocationRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class LocationService
{
    public function __construct(
        private LocationRepositoryInterface $locationRepository
    ) {}

    /**
     * Get paginated locations with optional filters.
     */
    public function getPaginatedLocations(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->locationRepository->getPaginated($filters, $perPage);
    }

    /**
     * Get all locations.
     */
    public function getAllLocations(): Collection
    {
        return $this->locationRepository->getAll();
    }

    /**
     * Find a location by ID.
     */
    public function findLocation(int $id): ?Location
    {
        return $this->locationRepository->findById($id);
    }

    /**
     * Create a new location.
     */
    public function createLocation(array $data): Location
    {
        // Sanitize input data
        $sanitizedData = $this->sanitizeLocationData($data);
        
        return $this->locationRepository->create($sanitizedData);
    }

    /**
     * Update an existing location.
     */
    public function updateLocation(Location $location, array $data): Location
    {
        // Sanitize input data
        $sanitizedData = $this->sanitizeLocationData($data);
        
        return $this->locationRepository->update($location, $sanitizedData);
    }

    /**
     * Delete a location.
     */
    public function deleteLocation(Location $location): bool
    {
        return $this->locationRepository->delete($location);
    }

    /**
     * Check if a location code is unique.
     */
    public function isCodeUnique(string $code, ?int $excludeId = null): bool
    {
        return $this->locationRepository->isCodeUnique($code, $excludeId);
    }

    /**
     * Sanitize location data to prevent XSS and other security issues.
     */
    private function sanitizeLocationData(array $data): array
    {
        $sanitized = [];
        
        if (isset($data['code'])) {
            $sanitized['code'] = strip_tags(trim($data['code']));
        }
        
        if (isset($data['name'])) {
            $sanitized['name'] = strip_tags(trim($data['name']));
        }
        
        if (isset($data['image'])) {
            $sanitized['image'] = filter_var(trim($data['image']), FILTER_SANITIZE_URL);
        }
        
        return $sanitized;
    }
}