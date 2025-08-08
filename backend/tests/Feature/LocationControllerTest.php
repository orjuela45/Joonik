<?php

namespace Tests\Feature;

use App\Models\Location;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LocationControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    private array $headers;

    protected function setUp(): void
    {
        parent::setUp();
        $this->headers = [
            'X-API-Key' => 'joonik-secret-api-key-2024',
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ];
    }

    public function test_can_list_locations_with_pagination(): void
    {
        Location::factory()->count(15)->create();

        $response = $this->getJson('/api/v1/locations', $this->headers);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'code', 'name', 'image', 'created_at', 'updated_at']
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total'
                ]
            ]);

        $this->assertEquals(15, count($response->json('data')));
    }

    public function test_can_filter_locations_by_name(): void
    {
        Location::factory()->create(['name' => 'Test Location']);
        Location::factory()->create(['name' => 'Another Location']);

        $response = $this->getJson('/api/v1/locations?name=Test', $this->headers);

        $response->assertStatus(200);
        $this->assertEquals(1, count($response->json('data')));
        $this->assertStringContainsString('Test', $response->json('data.0.name'));
    }

    public function test_can_filter_locations_by_code(): void
    {
        Location::factory()->create(['code' => 'TEST001']);
        Location::factory()->create(['code' => 'PROD001']);

        $response = $this->getJson('/api/v1/locations?code=TEST', $this->headers);

        $response->assertStatus(200);
        $this->assertEquals(1, count($response->json('data')));
        $this->assertStringContainsString('TEST', $response->json('data.0.code'));
    }

    public function test_can_show_single_location(): void
    {
        $location = Location::factory()->create();

        $response = $this->getJson("/api/v1/locations/{$location->id}", $this->headers);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['id', 'code', 'name', 'image', 'created_at', 'updated_at']
            ])
            ->assertJson([
                'data' => [
                    'id' => $location->id,
                    'code' => $location->code,
                    'name' => $location->name
                ]
            ]);
    }

    public function test_returns_404_for_non_existent_location(): void
    {
        $response = $this->getJson('/api/v1/locations/999', $this->headers);

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'No query results for model [App\\Models\\Location] 999'
            ]);
    }

    public function test_can_create_location(): void
    {
        $locationData = [
            'code' => 'NEW001',
            'name' => 'New Test Location',
            'image' => 'https://example.com/image.jpg'
        ];

        $response = $this->postJson('/api/v1/locations', $locationData, $this->headers);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'code', 'name', 'image', 'created_at', 'updated_at']
            ])
            ->assertJson([
                'data' => [
                    'code' => 'NEW001',
                    'name' => 'New Test Location',
                    'image' => 'https://example.com/image.jpg'
                ]
            ]);

        $this->assertDatabaseHas('locations', [
            'code' => 'NEW001',
            'name' => 'New Test Location'
        ]);
    }

    public function test_validates_required_fields_on_create(): void
    {
        $response = $this->postJson('/api/v1/locations', [], $this->headers);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code', 'name']);
    }

    public function test_validates_unique_code_on_create(): void
    {
        Location::factory()->create(['code' => 'DUPLICATE']);

        $locationData = [
            'code' => 'DUPLICATE',
            'name' => 'Test Location'
        ];

        $response = $this->postJson('/api/v1/locations', $locationData, $this->headers);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_can_update_location(): void
    {
        $location = Location::factory()->create();
        $updateData = [
            'name' => 'Updated Location Name',
            'image' => 'https://example.com/updated-image.jpg'
        ];

        $response = $this->putJson("/api/v1/locations/{$location->id}", $updateData, $this->headers);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $location->id,
                    'name' => 'Updated Location Name',
                    'image' => 'https://example.com/updated-image.jpg'
                ]
            ]);

        $this->assertDatabaseHas('locations', [
            'id' => $location->id,
            'name' => 'Updated Location Name'
        ]);
    }

    public function test_validates_unique_code_on_update(): void
    {
        $location1 = Location::factory()->create(['code' => 'CODE001']);
        $location2 = Location::factory()->create(['code' => 'CODE002']);

        $updateData = ['code' => 'CODE001'];

        $response = $this->putJson("/api/v1/locations/{$location2->id}", $updateData, $this->headers);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }

    public function test_can_delete_location(): void
    {
        $location = Location::factory()->create();

        $response = $this->deleteJson("/api/v1/locations/{$location->id}", [], $this->headers);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Location deleted successfully'
            ]);
        $this->assertDatabaseMissing('locations', ['id' => $location->id]);
    }

    public function test_returns_404_when_deleting_non_existent_location(): void
    {
        $response = $this->deleteJson('/api/v1/locations/999', [], $this->headers);

        $response->assertStatus(404);
    }

    public function test_requires_api_key_for_all_endpoints(): void
    {
        $location = Location::factory()->create();
        $headersWithoutApiKey = ['Accept' => 'application/json'];

        // Test all endpoints without API key
        $this->getJson('/api/v1/locations', $headersWithoutApiKey)->assertStatus(401);
        $this->getJson("/api/v1/locations/{$location->id}", $headersWithoutApiKey)->assertStatus(401);
        $this->postJson('/api/v1/locations', [], $headersWithoutApiKey)->assertStatus(401);
        $this->putJson("/api/v1/locations/{$location->id}", [], $headersWithoutApiKey)->assertStatus(401);
        $this->deleteJson("/api/v1/locations/{$location->id}", [], $headersWithoutApiKey)->assertStatus(401);
    }

    public function test_pagination_parameters(): void
    {
        // Clear existing locations and create fresh test data
        Location::query()->delete();
        Location::factory()->count(25)->create();

        $response = $this->getJson('/api/v1/locations?per_page=10', $this->headers);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [],
                'meta' => [
                    'current_page',
                    'per_page',
                    'total',
                    'total_pages'
                ]
            ]);
        
        // Verify we have the expected number of items
        $data = $response->json('data');
        $meta = $response->json('meta');
        
        $this->assertCount(10, $data);
        $this->assertEquals(10, $meta['per_page'][0]);
        $this->assertEquals(25, $meta['total'][0]);
        $this->assertEquals(1, $meta['current_page'][0]);
        $this->assertEquals(3, $meta['total_pages']);
    }
}