<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ActivityModel;

class Registrations extends ResourceController
{
    protected $modelName = 'App\Models\ActivityModel';
    protected $format    = 'json';

    public function index()
    {
        $month = $this->request->getGet('month');
        $records = $this->fetchFormattedActivities(null, $month);
        return $this->respond($records);
    }

    public function mobilizationReports()
    {
        $type = $this->request->getGet('type');
        $month = $this->request->getGet('month');
        $records = $this->fetchFormattedActivities($type, $month);
        return $this->respond([
            'status' => 200,
            'data'   => $records
        ]);
    }

    private function fetchFormattedActivities(?string $type = null, ?string $month = null): array
    {
        $db = \Config\Database::connect();
        $builder = $db->table('activities a');
        $builder->select('
            a.*, 
            c.name as corporate_name, 
            cp.name as plant_name, 
            cd.name as division_name, 
            u.name as user_name, 
            u.last_name as user_last_name, 
            u.email as user_email, 
            u.phone as user_phone,
            u.organization_name as user_organization,
            u.municipality as user_municipality,
            u.state as user_state
        ');
        $builder->join('corporates c', 'c.id = a.corporate_id', 'left');
        $builder->join('corporate_plants cp', 'cp.id = a.plant_id', 'left');
        $builder->join('corporate_divisions cd', 'cd.id = a.division_id', 'left');
        $builder->join('users u', 'u.id = a.user_id', 'left');
        $builder->where('a.deleted_at', null);

        if (!empty($month)) {
            $builder->where('MONTH(a.registration_date)', $month);
        }

        if (!empty($type) && strtolower($type) !== 'all' && strtolower($type) !== 'todas') {
            $norm = strtolower(trim($type));
            if ($norm === 'corporativa' || $norm === 'corporativo') {
                $builder->whereIn('a.modality', ['Corporativa', 'Corporativo']);
            } elseif ($norm === 'personal') {
                $builder->whereIn('a.modality', ['Personal', 'Ciudadana', 'Individual']);
            } elseif ($norm === 'sociedad civil' || $norm === 'comunidad' || $norm === 'sociedad_civil') {
                $builder->whereIn('a.modality', ['Sociedad civil', 'Sociedad Civil', 'Comunidad', 'Brigada']);
            } elseif ($norm === 'escuela') {
                $builder->whereIn('a.modality', ['Escuela', 'Plantel', 'Educativa']);
            } elseif ($norm === 'institucional') {
                $builder->whereIn('a.modality', ['Institucional']);
            } else {
                $builder->where('a.modality', $type);
            }
        }

        $builder->orderBy('a.registration_date', 'DESC');
        $results = $builder->get()->getResultArray();

        return array_map([$this, 'formatActivityRecord'], $results ?: []);
    }

    private function formatActivityRecord(array $row): array
    {
        $desc = (string) ($row['description'] ?? '');
        $actName = '';
        $locName = '';

        if (preg_match('/Actividad:\s*([^|\n]+)/i', $desc, $m)) {
            $actName = trim($m[1]);
        }
        if (preg_match('/Lugar:\s*([^\n]+)/i', $desc, $m)) {
            $locName = trim($m[1]);
        }

        $volunteers = (int) ($row['total_volunteers'] ?? 1);
        $duration   = (float) ($row['individual_hours_duration'] ?? 0);
        $totalHours = $volunteers * $duration;

        $orgName = $row['corporate_name'] ?: ($row['user_organization'] ?? '');
        $plantName = $row['plant_name'] ?? '';
        $divisionName = $row['division_name'] ?? '';
        
        $groupParts = array_filter([$orgName, $divisionName, $plantName]);
        $groupName = !empty($groupParts) ? implode(' - ', $groupParts) : trim(($row['user_name'] ?? '') . ' ' . ($row['user_last_name'] ?? ''));

        $customActivity = $actName ?: ($orgName ? ('Voluntariado ' . $orgName) : 'Actividad Ciudadana');

        return array_merge($row, [
            'volunteer_count'           => $volunteers,
            'duration_hours'            => $duration,
            'total_hours'               => $totalHours,
            'activity_type'             => $row['modality'] ?: 'Corporativa',
            'custom_activity_name'      => $customActivity,
            'catalog_activity_name'     => $customActivity,
            'activity_name'             => $customActivity,
            'location_name'             => $locName ?: ($row['user_municipality'] ?? 'Chihuahua'),
            'location_address'          => trim(($row['user_municipality'] ?? '') . ', ' . ($row['user_state'] ?? '')),
            'scheduled_date'            => $row['registration_date'] ?? '',
            'execution_date'            => $row['registration_date'] ?? '',
            'evidence_links'            => $row['evidence_image_url'] ?? '',
            'group_name'                => $groupName,
            'user_organization'         => $orgName,
            'beneficiaries_count'       => (int) ($row['beneficiaries_count'] ?? 0),
        ]);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        if (empty($data)) {
            $data = $this->request->getRawInput();
        }
        
        if ($this->model->update($id, $data)) {
            return $this->respond(['status' => 200, 'message' => 'Actividad actualizada por administración']);
        }
        return $this->fail($this->model->errors());
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['status' => 200, 'message' => 'Actividad eliminada']);
        }
        return $this->failNotFound('Registro no encontrado');
    }
}
