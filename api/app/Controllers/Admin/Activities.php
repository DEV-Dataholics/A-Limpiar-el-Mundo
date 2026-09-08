<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ActivityCatalogModel;

class Activities extends ResourceController
{
    protected $modelName = 'App\Models\ActivityCatalogModel';
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) return $this->failNotFound('Causa no encontrada');
        return $this->respond($data);
    }

    public function create()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        
        $data = $this->applyBusinessRules($data);

        if ($this->model->insert($data)) {
            return $this->respondCreated(['status' => 201, 'message' => 'Causa creada exitosamente']);
        }
        return $this->fail($this->model->errors());
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();
        
        $data = $this->applyBusinessRules($data);

        if ($this->model->update($id, $data)) {
            return $this->respond(['status' => 200, 'message' => 'Causa actualizada']);
        }
        return $this->fail($this->model->errors());
    }

    private function applyBusinessRules($data)
    {
        if (isset($data['type']) && $data['type'] === 'community') {
            // Limpiar datos institucionales si es comunidad
            $data['min_capacity'] = null;
            $data['max_capacity'] = null;
            $data['event_date'] = null;
            $data['cancellation_days_before'] = null;
        }
        
        // Regla: Institucional requiere min_capacity
        // if ($data['type'] === 'institutional' && empty($data['min_capacity'])) { ... } // Podría añadirse si es estricto
        
        return $data;
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['status' => 200, 'message' => 'Causa eliminada (Soft Delete)']);
        }
        return $this->failNotFound('Causa no encontrada');
    }
}
