<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ImpactRegistrationModel;

class Registrations extends ResourceController
{
    protected $modelName = 'App\Models\ImpactRegistrationModel';
    protected $format    = 'json';

    public function index()
    {
        // Traer registros con info de usuario y actividad
        $db = \Config\Database::connect();
        $builder = $db->table('impact_registrations');
        $builder->select('impact_registrations.*, users.name as user_name, users.last_name as user_last_name, users.email as user_email, users.phone as user_phone, users.organization_name as user_organization, users.state as user_state, users.municipality as user_municipality, users.age as user_age, activities_catalog.name as activity_name');
        $builder->join('users', 'users.id = impact_registrations.user_id');
        $builder->join('activities_catalog', 'activities_catalog.id = impact_registrations.activity_id');
        $builder->where('impact_registrations.deleted_at', null);

        $activityId = $this->request->getGet('activity_id');
        if ($activityId) {
            $builder->where('impact_registrations.activity_id', $activityId);
        }

        $builder->orderBy('impact_registrations.created_at', 'DESC');
        
        $query = $builder->get();
        $results = $query->getResultArray();
        
        return $this->respond(is_array($results) ? $results : []);
    }

    // ─── Reporteador de Movilizaciones Ciudadanas (Ajuste #13) ──────────────────────
    // GET /api/admin/reports/mobilizations?type=Corporativa
    public function mobilizationReports()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('impact_registrations');
        $builder->select(
            'impact_registrations.id,
             impact_registrations.custom_activity_name,
             impact_registrations.activity_type,
             impact_registrations.group_name,
             impact_registrations.location_name,
             impact_registrations.execution_date,
             impact_registrations.scheduled_date,
             impact_registrations.duration_hours,
             impact_registrations.volunteer_count,
             impact_registrations.beneficiaries_count,
             impact_registrations.description,
             impact_registrations.evidence_links,
             impact_registrations.status,
             impact_registrations.created_at,
             users.name as user_name,
             users.last_name as user_last_name,
             users.email as user_email,
             users.phone as user_phone,
             users.municipality as user_municipality,
             users.state as user_state,
             users.organization_name as user_organization,
             activities_catalog.name as catalog_activity_name'
        );
        $builder->join('users', 'users.id = impact_registrations.user_id');
        // LEFT JOIN: los registros con custom_activity_name no tienen causa del catálogo
        $builder->join('activities_catalog', 'activities_catalog.id = impact_registrations.activity_id', 'left');
        $builder->where('impact_registrations.deleted_at', null);
        // Modelo B2B: excluir institucionales, filtrar por activity_type del registro
        $builder->where('impact_registrations.activity_type !=', 'Institucional');

        // Filtrar por tipo de movilización si se provee en query param
        $type = $this->request->getGet('type');
        if ($type) {
            $builder->where('impact_registrations.activity_type', $type);
        }

        $builder->orderBy('impact_registrations.execution_date', 'DESC');
        $results = $builder->get()->getResultArray();

        return $this->respond(['status' => 200, 'data' => $results, 'count' => count($results)]);
    }

    public function update($id = null)
    {
        // Usado para aprobar/rechazar o dar feedback
        $data = $this->request->getJSON(true);
        
        if (empty($data)) {
            $data = $this->request->getRawInput();
        }
        
        if ($this->model->update($id, $data)) {
            return $this->respond(['status' => 200, 'message' => 'Registro actualizado por administración']);
        }
        return $this->fail($this->model->errors());
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['status' => 200, 'message' => 'Movilización eliminada de la vista pública']);
        }
        return $this->failNotFound('Registro no encontrado');
    }
}
