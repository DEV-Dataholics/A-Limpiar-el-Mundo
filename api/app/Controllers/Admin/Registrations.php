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
            u.phone as user_phone
        ');
        $builder->join('corporates c', 'c.id = a.corporate_id', 'left');
        $builder->join('corporate_plants cp', 'cp.id = a.plant_id', 'left');
        $builder->join('corporate_divisions cd', 'cd.id = a.division_id', 'left');
        $builder->join('users u', 'u.id = a.user_id', 'left');
        $builder->where('a.deleted_at', null);

        // Optional filter for month (accumulated logic on frontend/backend)
        $month = $this->request->getGet('month');
        if ($month) {
            $builder->where('MONTH(a.registration_date)', $month);
        }

        $builder->orderBy('a.registration_date', 'DESC');
        
        $results = $builder->get()->getResultArray();
        return $this->respond(is_array($results) ? $results : []);
    }

    public function mobilizationReports()
    {
        // For accumulated export
        return $this->index();
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
