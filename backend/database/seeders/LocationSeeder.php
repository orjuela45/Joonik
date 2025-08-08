<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            [
                'code' => 'EIFFEL',
                'name' => 'Torre Eiffel',
                'image' => 'https://example.com/images/eiffel-tower.jpg',
            ],
            [
                'code' => 'SAGRADA',
                'name' => 'Sagrada Familia',
                'image' => 'https://example.com/images/sagrada-familia.jpg',
            ],
            [
                'code' => 'COLISEO',
                'name' => 'Coliseo Romano',
                'image' => 'https://example.com/images/colosseum.jpg',
            ],
            [
                'code' => 'BIGBEN',
                'name' => 'Big Ben',
                'image' => 'https://example.com/images/big-ben.jpg',
            ],
            [
                 'code' => 'LIBERTY',
                 'name' => 'Estatua de la Libertad',
                 'image' => 'https://example.com/images/statue-of-liberty.jpg',
             ],
             [
                 'code' => 'MACHU',
                 'name' => 'Machu Picchu',
                 'image' => 'https://example.com/images/machu-picchu.jpg',
             ],
             [
                 'code' => 'TAJMAHAL',
                 'name' => 'Taj Mahal',
                 'image' => 'https://example.com/images/taj-mahal.jpg',
             ],
             [
                 'code' => 'CRISTO',
                 'name' => 'Cristo Redentor',
                 'image' => 'https://example.com/images/cristo-redentor.jpg',
             ],
             [
                 'code' => 'PETRA',
                 'name' => 'Petra',
                 'image' => 'https://example.com/images/petra.jpg',
             ],
             [
                 'code' => 'CHICHEN',
                 'name' => 'Chichen Itzá',
                 'image' => 'https://example.com/images/chichen-itza.jpg',
             ],
         ];

        foreach ($locations as $location) {
            \App\Models\Location::create($location);
        }
    }
}
