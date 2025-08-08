<?php

namespace App\Repositories;

use App\Models\Location;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class LocationRepository implements LocationRepositoryInterface
{
    /**
     * Get all locations.
     */
    public function getAll(): Collection
    {
        return Location::orderBy('created_at', 'desc')->get();
    }

    /**
     * Get paginated locations with filters.
     */
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Location::query();

        // Apply name filter
        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        // Apply code filter
        if (!empty($filters['code'])) {
            $query->where('code', 'like', '%' . $filters['code'] . '%');
        }

        // Apply ordering
        $query->orderBy('created_at', 'desc');

        return $query->paginate($perPage);
    }

    /**
     * Find a location by ID.
     */
    public function findById(int $id): ?Location
    {
        return Location::find($id);
    }

    /**
     * Create a new location.
     */
    public function create(array $data): Location
    {
        return Location::create($data);
    }

    /**
     * Update an existing location.
     */
    public function update(Location $location, array $data): Location
    {
        $location->update($data);
        return $location->fresh();
    }

    /**
     * Delete a location.
     */
    public function delete(Location $location): bool
    {
        return $location->delete();
    }

    /**
     * Check if a location code is unique.
     */
    public function isCodeUnique(string $code, ?int $excludeId = null): bool
    {
        $query = Location::where('code', $code);
        
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        return !$query->exists();
    }
}