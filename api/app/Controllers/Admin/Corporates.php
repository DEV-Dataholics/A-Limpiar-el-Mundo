<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CorporateModel;
use App\Models\CorporatePlantModel;
use App\Models\CorporateDivisionModel;

class Corporates extends ResourceController
{
    protected $modelName = 'App\Models\CorporateModel';
    protected $format    = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        
        // 1. Obtener todos los corporativos con conteos
        $corps = $db->table('corporates c')
            ->select('c.*, COUNT(DISTINCT cp.id) as plants_count, COUNT(DISTINCT cd.id) as divisions_count')
            ->join('corporate_plants cp', 'cp.corporate_id = c.id', 'left')
            ->join('corporate_divisions cd', 'cd.corporate_id = c.id', 'left')
            ->where('c.deleted_at', null)
            ->groupBy('c.id')
            ->orderBy('c.name', 'ASC')
            ->get()
            ->getResultArray();

        // 2. Obtener plantas con sus divisiones para vista expandida
        $plants = $db->table('corporate_plants cp')
            ->select('cp.*, cd.name as division_name, c.name as corporate_name')
            ->join('corporates c', 'c.id = cp.corporate_id')
            ->join('corporate_divisions cd', 'cd.id = cp.division_id', 'left')
            ->orderBy('c.name ASC, cp.name ASC')
            ->get()
            ->getResultArray();

        // 3. Obtener divisiones
        $divModel = new CorporateDivisionModel();
        $divisions = $divModel->findAll();

        return $this->respond([
            'status'     => 200,
            'corporates' => $corps,
            'plants'     => $plants,
            'divisions'  => $divisions,
        ]);
    }

    public function create()
    {
        $name = trim((string) $this->request->getVar('name'));
        if (empty($name)) {
            return $this->failValidationErrors(['name' => 'El nombre de la empresa es obligatorio.']);
        }

        helper('text');
        helper('url');

        $slug = url_title($name, '-', true);
        
        // Evitar duplicados de slug
        $existing = $this->model->where('slug', $slug)->first();
        if ($existing) {
            $slug .= '-' . substr(md5(uniqid()), 0, 4);
        }

        $data = [
            'name'            => $name,
            'slug'            => $slug,
            'code'            => $this->request->getVar('code') ?: null,
            'total_headcount' => (int) ($this->request->getVar('total_headcount') ?: 0),
            'is_active'       => 1,
            'created_at'      => date('Y-m-d H:i:s'),
            'updated_at'      => date('Y-m-d H:i:s'),
        ];

        $id = $this->model->insert($data);
        if (!$id) {
            return $this->failServerError('Error al crear la empresa.');
        }

        $newCorporate = $this->model->find($id);

        // Si se proporcionó un nombre de planta inicial opcional, crearla
        $initialPlant = trim((string) $this->request->getVar('initial_plant_name'));
        if (!empty($initialPlant)) {
            $plantModel = new CorporatePlantModel();
            $plantModel->insert([
                'corporate_id'  => $id,
                'division_id'   => null,
                'name'          => $initialPlant,
                'location_name' => $this->request->getVar('location_name') ?: null,
                'created_at'    => date('Y-m-d H:i:s'),
                'updated_at'    => date('Y-m-d H:i:s'),
            ]);
        }

        return $this->respondCreated([
            'status'    => 201,
            'message'   => 'Empresa creada exitosamente.',
            'corporate' => $newCorporate,
        ]);
    }

    public function createPlant()
    {
        $corpId = (int) $this->request->getVar('corporate_id');
        $name   = trim((string) $this->request->getVar('name'));

        if (!$corpId || empty($name)) {
            return $this->failValidationErrors([
                'corporate_id' => 'Debe seleccionar un corporativo.',
                'name'         => 'El nombre de la planta es obligatorio.'
            ]);
        }

        $plantModel = new CorporatePlantModel();
        $divisionId = $this->request->getVar('division_id') ? (int) $this->request->getVar('division_id') : null;

        $plantId = $plantModel->insert([
            'corporate_id'  => $corpId,
            'division_id'   => $divisionId,
            'name'          => $name,
            'location_name' => $this->request->getVar('location_name') ?: null,
            'created_at'    => date('Y-m-d H:i:s'),
            'updated_at'    => date('Y-m-d H:i:s'),
        ]);

        if (!$plantId) {
            return $this->failServerError('Error al registrar la planta.');
        }

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Planta agregada exitosamente.',
            'plant'   => $plantModel->find($plantId),
        ]);
    }

    public function delete($id = null)
    {
        $corp = $this->model->find($id);
        if (!$corp) {
            return $this->failNotFound('Empresa no encontrada.');
        }

        $db = \Config\Database::connect();
        $db->disableForeignKeyChecks();
        $db->table('corporate_plants')->where('corporate_id', $id)->delete();
        $db->table('corporate_divisions')->where('corporate_id', $id)->delete();
        $this->model->delete($id, true);
        $db->enableForeignKeyChecks();

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Empresa y sus plantas eliminadas exitosamente.'
        ]);
    }

    public function deletePlant($id = null)
    {
        $plantModel = new CorporatePlantModel();
        $plant = $plantModel->find($id);
        if (!$plant) {
            return $this->failNotFound('Planta no encontrada.');
        }

        $plantModel->delete($id);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Planta eliminada exitosamente.'
        ]);
    }
}
