<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class Users extends ResourceController
{
    protected $modelName = 'App\Models\UserModel';
    protected $format    = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('users u')
            ->select('u.id, u.name, u.last_name, u.email, u.phone, u.phone as plant_phone, u.role_id, u.created_at, u.deleted_at, u.organization_name, cp.name as plant_name, cd.name as division_name, c.name as corporate_name, COUNT(a.id) as total_activities')
            ->join('corporate_plants cp', 'cp.id = u.plant_id', 'left')
            ->join('corporate_divisions cd', 'cd.id = u.division_id', 'left')
            ->join('corporates c', 'c.id = cp.corporate_id', 'left')
            ->join('activities a', 'a.user_id = u.id AND a.deleted_at IS NULL', 'left')
            ->where('u.role_id !=', 1)
            ->groupBy('u.id, u.name, u.last_name, u.email, u.phone, u.role_id, u.created_at, u.deleted_at, u.organization_name, cp.name, cd.name, c.name')
            ->orderBy('u.id', 'DESC');

        return $this->respond($builder->get()->getResultArray());
    }

    public function delete($id = null)
    {
        // Forzamos borrado físico para permitir que el correo sea liberado y reutilizado
        if ($this->model->delete($id, true)) {
            return $this->respondDeleted(['status' => 200, 'message' => 'Usuario eliminado permanentemente del sistema']);
        }
        return $this->failNotFound('Usuario no encontrado');
    }
}
