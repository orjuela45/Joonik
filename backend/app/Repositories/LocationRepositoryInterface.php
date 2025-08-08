<?php

namespace App\Repositories;

use App\Models\Location;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface LocationRepositoryInterface
{
    /**
     * Get all locations.
     */
    public function getAll(): Collection;

    /**
     * Get paginated locations with filters.
     */
    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    /**
     * Find a location by ID.
     */
    public function findById(int $id): ?Location;

    /**
     * Create a new location.
     */
    public function create(array $data): Location;

    /**
     * Update an existing location.
     */
    public function update(Location $location, array $data): Location;

    /**
     * Delete a location.
     */
    public function delete(Location $location): bool;

    /**
     * Check if a location code is unique.
     */
    public function isCodeUnique(string $code, ?int $excludeId = null): bool;
}