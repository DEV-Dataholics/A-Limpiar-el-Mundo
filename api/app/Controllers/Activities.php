<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class Activities extends ResourceController
{
    use ResponseTrait;
    protected $modelName = 'App\Models\ActivityCatalogModel';
    protected $format    = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('activities_catalog');
        
        // Obtenemos todas las actividades
        $activities = $builder->get()->getResultArray();
        
        if (empty($activities)) {
            $this->seedInitialData();
            $activities = $builder->get()->getResultArray();
        }

        // Enriquecemos con lugares disponibles
        foreach ($activities as &$activity) {
            $regBuilder = $db->table('impact_registrations');
            $regBuilder->selectSum('volunteer_count');
            $regBuilder->where('activity_id', $activity['id']);
            $regBuilder->where('status !=', 'cancelled');
            $result = $regBuilder->get()->getRow();
            
            $occupied = (int)($result->volunteer_count ?? 0);
            $activity['occupied_spots'] = $occupied;
            $activity['available_spots'] = max(0, $activity['max_capacity'] - $occupied);
        }
        
        return $this->respond($activities);
    }

    private function seedInitialData()
    {
        $data = [
            [
                'name' => 'Vivero Municipal',
                'min_capacity' => 10,
                'max_capacity' => 100,
                'is_open_mobilization' => 0,
                'requires_10_days_notice' => 1,
                'long_description' => 'Producción de plantas nativas para reforestación. Ropa cómoda, gorra y protector solar recomendados.',
                'image_url' => 'https://images.unsplash.com/photo-1594818345462-1c6fa5e5fc17?w=600'
            ],
            [
                'name' => 'Banco de Alimentos',
                'min_capacity' => 15,
                'max_capacity' => 50,
                'is_open_mobilization' => 0,
                'requires_10_days_notice' => 1,
                'long_description' => 'Selección y empaquetado de alimentos para familias vulnerables. Se requiere calzado cerrado.',
                'image_url' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600'
            ],
            [
                'name' => 'Ludomóvil',
                'min_capacity' => 10,
                'max_capacity' => 25,
                'is_open_mobilization' => 0,
                'requires_10_days_notice' => 1,
                'long_description' => 'Actividades recreativas y educativas itinerantes para niñas y niños en diversas comunidades.',
                'image_url' => 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600'
            ],
            [
                'name' => 'Todos a leer',
                'min_capacity' => 10,
                'max_capacity' => 20,
                'is_open_mobilization' => 0,
                'requires_10_days_notice' => 1,
                'long_description' => 'Fomento a la lectura en espacios comunitarios. ¡Trae tu libro favorito y comparte!',
                'image_url' => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'
            ],
            [
                'name' => 'Descubre jugando ludoteca',
                'min_capacity' => 10,
                'max_capacity' => 50,
                'is_open_mobilization' => 0,
                'requires_10_days_notice' => 1,
                'long_description' => 'Apoyo en actividades lúdicas permanentes dentro de la ludoteca comunitaria.',
                'image_url' => 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600'
            ],
            [
                'name' => 'Mejoremos la escuela de nuestros hijos',
                'min_capacity' => 10,
                'max_capacity' => 50,
                'is_open_mobilization' => 0,
                'requires_10_days_notice' => 1,
                'long_description' => 'Jornadas de mantenimiento escolar (pintura, jardinería, limpieza).',
                'image_url' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600'
            ],
            [
                'name' => 'Zona STEAM',
                'min_capacity' => 5,
                'max_capacity' => 20,
                'is_open_mobilization' => 0,
                'requires_10_days_notice' => 1,
                'long_description' => 'Talleres de Ciencia, Tecnología, Ingeniería, Arte y Matemáticas para jóvenes.',
                'image_url' => 'https://images.unsplash.com/photo-1564325724739-bae0bd08bc62?w=600'
            ],
            [
                'name' => 'Colecta Korima',
                'min_capacity' => 5,
                'max_capacity' => 50,
                'is_open_mobilization' => 0,
                'requires_10_days_notice' => 1,
                'long_description' => 'Recaudación de fondos y artículos de primera necesidad para comunidades con carencias.',
                'image_url' => 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600'
            ],
            [
                'name' => 'Movilización Propia',
                'min_capacity' => 1,
                'max_capacity' => 999,
                'is_open_mobilization' => 1,
                'requires_10_days_notice' => 0,
                'long_description' => 'Cualquier acción que beneficie directamente a tu comunidad.',
                'image_url' => 'https://images.unsplash.com/photo-1559027615-cd26735550b4?w=600'
            ]
        ];
        $this->model->insertBatch($data);
    }

    public function reset()
    {
        $db = \Config\Database::connect();
        $db->query('SET FOREIGN_KEY_CHECKS = 0');
        $this->model->truncate();
        $db->query('SET FOREIGN_KEY_CHECKS = 1');
        return $this->index();
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if ($data) {
            return $this->respond($data);
        }
        return $this->failNotFound('Activity not found');
    }
}
