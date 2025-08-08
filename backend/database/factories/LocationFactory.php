<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Location>
 */
class LocationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Location::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper($this->faker->unique()->lexify('???###')),
            'name' => $this->faker->company . ' ' . $this->faker->randomElement(['Office', 'Branch', 'Headquarters', 'Center']),
            'image' => $this->faker->imageUrl(640, 480, 'business', true, 'office'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Indicate that the location is a headquarters.
     */
    public function headquarters(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => $this->faker->company . ' Headquarters',
            'code' => 'HQ' . $this->faker->unique()->numerify('###'),
        ]);
    }

    /**
     * Indicate that the location is a branch office.
     */
    public function branch(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => $this->faker->city . ' Branch Office',
            'code' => 'BR' . $this->faker->unique()->numerify('###'),
        ]);
    }

    /**
     * Indicate that the location has no image.
     */
    public function withoutImage(): static
    {
        return $this->state(fn (array $attributes) => [
            'image' => null,
        ]);
    }

    /**
     * Create a location with a specific code.
     */
    public function withCode(string $code): static
    {
        return $this->state(fn (array $attributes) => [
            'code' => $code,
        ]);
    }

    /**
     * Create a location with a specific name.
     */
    public function withName(string $name): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => $name,
        ]);
    }
}