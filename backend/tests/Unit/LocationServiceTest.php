<?php

namespace Tests\Unit;

use App\Models\Location;
use App\Repositories\LocationRepositoryInterface;
use App\Services\LocationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Mockery;
use Tests\TestCase;

class LocationServiceTest extends TestCase
{
    private LocationService $locationService;
    private LocationRepositoryInterface $mockRepository;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->mockRepository = Mockery::mock(LocationRepositoryInterface::class);
        $this->locationService = new LocationService($this->mockRepository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_paginated_locations(): void
    {
        $filters = ['name' => 'test'];
        $perPage = 10;
        $mockPaginator = Mockery::mock(LengthAwarePaginator::class);

        $this->mockRepository
            ->shouldReceive('getPaginated')
            ->once()
            ->with($filters, $perPage)
            ->andReturn($mockPaginator);

        $result = $this->locationService->getPaginatedLocations($filters, $perPage);

        $this->assertInstanceOf(LengthAwarePaginator::class, $result);
    }

    public function test_get_all_locations(): void
    {
        $mockCollection = Mockery::mock(Collection::class);

        $this->mockRepository
            ->shouldReceive('getAll')
            ->once()
            ->andReturn($mockCollection);

        $result = $this->locationService->getAllLocations();

        $this->assertInstanceOf(Collection::class, $result);
    }

    public function test_find_location(): void
    {
        $locationId = 1;
        $location = Location::factory()->make(['id' => $locationId]);

        $this->mockRepository
            ->shouldReceive('findById')
            ->once()
            ->with($locationId)
            ->andReturn($location);

        $result = $this->locationService->findLocation($locationId);

        $this->assertInstanceOf(Location::class, $result);
        $this->assertEquals($locationId, $result->id);
    }

    public function test_create_location(): void
    {
        $data = [
            'code' => 'TEST001',
            'name' => 'Test Location',
            'image' => 'https://example.com/image.jpg'
        ];
        $location = Location::factory()->make($data);

        $this->mockRepository
            ->shouldReceive('create')
            ->once()
            ->with($data)
            ->andReturn($location);

        $result = $this->locationService->createLocation($data);

        $this->assertInstanceOf(Location::class, $result);
        $this->assertEquals($data['code'], $result->code);
    }

    public function test_update_location(): void
    {
        $location = Location::factory()->make(['id' => 1]);
        $data = [
            'name' => 'Updated Location',
            'image' => 'https://example.com/updated.jpg'
        ];
        $updatedLocation = Location::factory()->make(array_merge($location->toArray(), $data));

        $this->mockRepository
            ->shouldReceive('update')
            ->once()
            ->with($location, $data)
            ->andReturn($updatedLocation);

        $result = $this->locationService->updateLocation($location, $data);

        $this->assertInstanceOf(Location::class, $result);
        $this->assertEquals($data['name'], $result->name);
    }

    public function test_delete_location(): void
    {
        $location = Location::factory()->make(['id' => 1]);

        $this->mockRepository
            ->shouldReceive('delete')
            ->once()
            ->with($location)
            ->andReturn(true);

        $result = $this->locationService->deleteLocation($location);

        $this->assertTrue($result);
    }

    public function test_is_code_unique(): void
    {
        $code = 'TEST001';
        $excludeId = 1;

        $this->mockRepository
            ->shouldReceive('isCodeUnique')
            ->once()
            ->with($code, $excludeId)
            ->andReturn(true);

        $result = $this->locationService->isCodeUnique($code, $excludeId);

        $this->assertTrue($result);
    }

    public function test_sanitize_location_data(): void
    {
        $data = [
            'code' => '  <script>alert("xss")</script>TEST001  ',
            'name' => '  <b>Test</b> Location  ',
            'image' => '  https://example.com/image.jpg  '
        ];

        $location = Location::factory()->make();

        $this->mockRepository
            ->shouldReceive('create')
            ->once()
            ->with([
                'code' => 'alert("xss")TEST001',
                'name' => 'Test Location',
                'image' => 'https://example.com/image.jpg'
            ])
            ->andReturn($location);

        $result = $this->locationService->createLocation($data);

        $this->assertInstanceOf(Location::class, $result);
    }
}