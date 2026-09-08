<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CorporatePlantModel;
use App\Models\CorporateModel;

class CorporateController extends ResourceController
{
    protected $format = 'json';

    public function search()
    {
        $query = $this->request->getGet('q');
        
        $db = \Config\Database::connect();
        $builder = $db->table('corporate_plants cp');
        $builder->select('cp.id as plant_id, cp.name as plant_name, cp.division_id, cd.name as division_name, c.id as corporate_id, c.name as corporate_name');
        $builder->join('corporates c', 'c.id = cp.corporate_id');
        $builder->join('corporate_divisions cd', 'cd.id = cp.division_id', 'left');
        
        if (!empty($query)) {
            $builder->groupStart()
                    ->like('c.name', $query)
                    ->orLike('cd.name', $query)
                    ->orLike('cp.name', $query)
                    ->groupEnd();
        }
        
        $results = $builder->get()->getResultArray();
        
        $formatted = [];
        foreach ($results as $row) {
            $displayName = $row['corporate_name'];
            if (!empty($row['division_name'])) {
                $displayName .= ' - ' . $row['division_name'];
            }
            if (!empty($row['plant_name'])) {
                $displayName .= ' - ' . $row['plant_name'];
            }
            
            $formatted[] = [
                'id' => $row['plant_id'],
                'corporate_id' => $row['corporate_id'],
                'division_id' => $row['division_id'],
                'plant_id' => $row['plant_id'],
                'display_name' => $displayName
            ];
        }
        
        return $this->respond($formatted);
    }
}
