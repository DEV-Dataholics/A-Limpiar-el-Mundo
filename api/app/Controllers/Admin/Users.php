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
        // Listar todos incluyendo los eliminados lógicamente para permitir limpieza
        return $this->respond($this->model->withDeleted()->where('role_id !=', 1)->findAll());
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
