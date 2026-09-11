<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class CorporateController extends ResourceController
{
    protected $format = 'json';

    public function search()
    {
        $query = trim((string) $this->request->getGet('q'));
        $db = \Config\Database::connect();
        $formatted = [];
        $seen = [];

        // 1. Búsqueda en Plantas y Divisiones Corporativas
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

        $builder->limit(15);
        $plantResults = $builder->get()->getResultArray();

        foreach ($plantResults as $row) {
            $displayName = $row['corporate_name'];
            if (!empty($row['division_name'])) {
                $displayName .= ' - ' . $row['division_name'];
            }
            if (!empty($row['plant_name'])) {
                $displayName .= ' - ' . $row['plant_name'];
            }

            $key = 'plant_' . $row['plant_id'];
            if (!isset($seen[$key])) {
                $seen[$key] = true;
                $formatted[] = [
                    'id'           => (int) $row['plant_id'],
                    'name'         => $displayName,
                    'display_name' => $displayName,
                    'corporate_id' => (int) $row['corporate_id'],
                    'division_id'  => !empty($row['division_id']) ? (int) $row['division_id'] : null,
                    'plant_id'     => (int) $row['plant_id'],
                    'type'         => 'plant',
                ];
            }
        }

        // 2. Búsqueda en Corporativos Directos (nivel padre)
        $corpBuilder = $db->table('corporates c');
        $corpBuilder->select('c.id as corporate_id, c.name as corporate_name');
        if (!empty($query)) {
            $corpBuilder->like('c.name', $query);
        }
        $corpBuilder->limit(8);
        $corpResults = $corpBuilder->get()->getResultArray();

        foreach ($corpResults as $row) {
            $key = 'corp_' . $row['corporate_id'];
            if (!isset($seen[$key])) {
                $seen[$key] = true;
                $formatted[] = [
                    'id'           => (int) $row['corporate_id'],
                    'name'         => $row['corporate_name'],
                    'display_name' => $row['corporate_name'],
                    'corporate_id' => (int) $row['corporate_id'],
                    'division_id'  => null,
                    'plant_id'     => null,
                    'type'         => 'corporate',
                ];
            }
        }

        // 3. Si hay búsqueda y no es corporativo directo, buscar organizaciones/escuelas de usuarios
        if (!empty($query)) {
            $orgBuilder = $db->table('users');
            $orgBuilder->select('DISTINCT(organization_name) as org_name')
                       ->where('organization_name IS NOT NULL')
                       ->where('organization_name !=', '')
                       ->like('organization_name', $query)
                       ->limit(5);
            $orgResults = $orgBuilder->get()->getResultArray();

            foreach ($orgResults as $idx => $row) {
                $orgName = trim((string) $row['org_name']);
                $key = 'org_' . md5(strtolower($orgName));
                if (!isset($seen[$key])) {
                    $seen[$key] = true;
                    $formatted[] = [
                        'id'           => 9000 + $idx,
                        'name'         => $orgName,
                        'display_name' => $orgName,
                        'corporate_id' => null,
                        'division_id'  => null,
                        'plant_id'     => null,
                        'type'         => 'organization',
                    ];
                }
            }
        }

        return $this->respond($formatted);
    }
}
