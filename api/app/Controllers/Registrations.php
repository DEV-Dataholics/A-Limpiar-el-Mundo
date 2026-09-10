<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\ActivityModel;
use App\Models\CampaignModel;
use App\Models\UserModel;

class Registrations extends ResourceController
{
    use ResponseTrait;
    protected $format = 'json';

    private function ensureJwtClassesLoaded(): void
    {
        if (!class_exists('Firebase\\JWT\\JWT')) {
            @require_once ROOTPATH . 'vendor/firebase/php-jwt/src/JWT.php';
        }
        if (!class_exists('Firebase\\JWT\\Key')) {
            @require_once ROOTPATH . 'vendor/firebase/php-jwt/src/Key.php';
        }
    }

    private function getUserIdFromToken()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || strpos($authHeader, 'Bearer ') === false) {
            return null;
        }

        $token = str_replace('Bearer ', '', $authHeader);
        $key = getenv('JWT_SECRET');
        if (!$key) return null;

        try {
            $this->ensureJwtClassesLoaded();
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            return $decoded->sub;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function myEvents()
    {
        $userId = $this->getUserIdFromToken();
        if (!$userId) return $this->failUnauthorized('Acceso denegado.');

        $db = \Config\Database::connect();
        $builder = $db->table('activities a')
            ->select('a.*, c.name as corporate_name, cp.name as plant_name, cd.name as division_name, cam.name as campaign_name')
            ->join('corporates c', 'c.id = a.corporate_id', 'left')
            ->join('corporate_plants cp', 'cp.id = a.plant_id', 'left')
            ->join('corporate_divisions cd', 'cd.id = a.division_id', 'left')
            ->join('campaigns cam', 'cam.id = a.campaign_id', 'left')
            ->where('a.user_id', $userId)
            ->where('a.deleted_at', null)
            ->orderBy('a.id', 'DESC');

        return $this->respond($builder->get()->getResultArray());
    }

    public function create()
    {
        $userId = $this->getUserIdFromToken();
        if (!$userId) return $this->failUnauthorized('Acceso denegado.');

        // Validate Campaign is Open
        $campaignModel = new CampaignModel();
        $campaign = $campaignModel->where('slug', 'a-limpiar-el-mundo')->first();
        if (!$campaign) {
            return $this->failServerError('Campaña no encontrada.');
        }

        if (!$campaign['is_registration_open']) {
            return $this->fail('Los registros para la campaña están cerrados en este momento.');
        }

        // Validate September Date
        $regDate = $this->request->getVar('registration_date');
        if (!$regDate) {
            return $this->failValidationErrors(['registration_date' => 'La fecha es requerida.']);
        }
        
        $dateObj = \DateTime::createFromFormat('Y-m-d', $regDate);
        if (!$dateObj || $dateObj->format('m') !== '09') {
            return $this->failValidationErrors(['registration_date' => 'La actividad debe realizarse durante el mes de septiembre.']);
        }

        // Handle Corporate Predictive Search (plant_id / corporate_id)
        $plantId = $this->request->getVar('plant_id');
        $corporateId = $this->request->getVar('corporate_id');
        $divisionId = $this->request->getVar('division_id');

        if (!$corporateId) {
            return $this->failValidationErrors(['corporate_id' => 'Debe seleccionar a quién representa.']);
        }

        $rawModality = $this->request->getVar('modality') ?: $this->request->getVar('activity_type') ?: 'Corporativa';
        $modalityMap = [
            'corporativa' => 'Corporativa',
            'institucional' => 'Institucional',
            'escuela' => 'Escuela',
            'comunidad' => 'Comunidad',
        ];
        $normKey = strtolower(trim((string)$rawModality));
        $modality = $modalityMap[$normKey] ?? 'Corporativa';

        $data = [
            'campaign_id' => $campaign['id'],
            'corporate_id' => $corporateId,
            'plant_id' => $plantId ?: null,
            'division_id' => $divisionId ?: null,
            'user_id' => $userId,
            'registration_date' => $regDate,
            'total_volunteers' => $this->request->getVar('total_volunteers') ?: 1,
            'individual_hours_duration' => $this->request->getVar('individual_hours_duration') ?: 0,
            'accompanied_by_fuch' => $this->request->getVar('accompanied_by_fuch') ? 1 : 0,
            'modality' => $modality,
            'status' => 'approved',
            'description' => $this->request->getVar('description'),
        ];

        // Handle File Upload
        $evidenceFile = $this->request->getFile('evidence_image');
        if ($evidenceFile && $evidenceFile->isValid() && ! $evidenceFile->hasMoved()) {
            $newName = $evidenceFile->getRandomName();
            $evidenceFile->move(FCPATH . 'uploads', $newName);
            $data['evidence_image_url'] = base_url('uploads/' . $newName);
        }

        $activityModel = new ActivityModel();
        if ($activityModel->insert($data)) {
            return $this->respondCreated(['status' => 201, 'message' => 'Actividad registrada exitosamente.']);
        }

        return $this->failServerError('No fue posible guardar el registro.');
    }
}
