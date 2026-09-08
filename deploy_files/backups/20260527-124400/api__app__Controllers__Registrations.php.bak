<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Registrations extends ResourceController
{
    use ResponseTrait;
    protected $modelName = 'App\Models\ImpactRegistrationModel';
    protected $format    = 'json';

    private function ensureJwtClassesLoaded(): void
    {
        if (!class_exists('Firebase\\JWT\\JWT')) {
            @require_once ROOTPATH . 'vendor/firebase/php-jwt/src/JWT.php';
        }
        if (!class_exists('Firebase\\JWT\\Key')) {
            @require_once ROOTPATH . 'vendor/firebase/php-jwt/src/Key.php';
        }
    }

    public function index()
    {
        return $this->respond($this->model->where('status', 'approved')->findAll());
    }

    public function myEvents()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || strpos($authHeader, 'Bearer ') === false) {
            return $this->failUnauthorized('Acceso denegado. Requiere iniciar sesión.');
        }

        $token = str_replace('Bearer ', '', $authHeader);
        $key = getenv('JWT_SECRET');
        if (!$key) {
            return $this->failServerError('JWT_SECRET no configurado');
        }

        try {
            $this->ensureJwtClassesLoaded();
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userId = $decoded->sub;
        } catch (\Exception $e) {
            return $this->failUnauthorized('Token inválido o expirado.');
        }

        // Query tolerante a esquemas legacy (sin depender de soft deletes o columnas opcionales).
        $db = \Config\Database::connect();
        $regColumns = $db->getFieldNames('impact_registrations');
        $actColumns = $db->getFieldNames('activities_catalog');

        $selectParts = ['impact_registrations.*'];
        if (in_array('name', $actColumns, true)) {
            $selectParts[] = 'activities_catalog.name as title';
        }
        if (in_array('image_url', $actColumns, true)) {
            $selectParts[] = 'activities_catalog.image_url';
        }

        $builder = $db->table('impact_registrations')
            ->select(implode(', ', $selectParts))
            ->join('activities_catalog', 'activities_catalog.id = impact_registrations.activity_id', 'left')
            ->where('impact_registrations.user_id', $userId);

        if (in_array('deleted_at', $regColumns, true)) {
            $builder->where('impact_registrations.deleted_at', null);
        }

        $registrations = $builder
            ->orderBy('impact_registrations.id', 'DESC')
            ->get()
            ->getResultArray();

        return $this->respond($registrations);
    }

    public function create()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || strpos($authHeader, 'Bearer ') === false) {
            return $this->failUnauthorized('Acceso denegado. Requiere iniciar sesión.');
        }

        $token = str_replace('Bearer ', '', $authHeader);
        $key = getenv('JWT_SECRET');
        if (!$key) {
            return $this->failServerError('JWT_SECRET no configurado');
        }

        try {
            $this->ensureJwtClassesLoaded();
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userId = $decoded->sub;
        } catch (\Exception $e) {
            return $this->failUnauthorized('Token inválido o expirado.');
        }

        $activityType = trim((string) $this->request->getVar('activity_type'));
        $activityId = $this->request->getVar('activity_id');
        $db = \Config\Database::connect();
        $activityColumns = $db->getFieldNames('activities_catalog');
        $activitiesTable = $db->table('activities_catalog');

        // Evita depender de IDs "mágicos" en frontend (ej. 9) y asegura FK válida.
        $resolvedActivity = null;
        if (!empty($activityId)) {
            $resolvedActivity = $activitiesTable
                ->where('id', (int) $activityId)
                ->get()
                ->getRowArray();
        }

        if (empty($resolvedActivity) && strcasecmp($activityType, 'Institucional') !== 0) {
            $fallbackQuery = $db->table('activities_catalog');
            if (in_array('is_open_mobilization', $activityColumns, true)) {
                $fallbackQuery->where('is_open_mobilization', 1);
            } elseif (in_array('name', $activityColumns, true)) {
                $fallbackQuery->like('name', 'Moviliza', 'both');
            }

            $resolvedActivity = $fallbackQuery
                ->orderBy('id', 'ASC')
                ->get(1)
                ->getRowArray();

            if ($resolvedActivity) {
                $activityId = (int) $resolvedActivity['id'];
            }
        }

        if (empty($resolvedActivity) && strcasecmp($activityType, 'Institucional') === 0) {
            return $this->failValidationErrors([
                'activity_id' => 'Selecciona una causa institucional válida.'
            ]);
        }

        if (empty($activityId)) {
            return $this->failValidationErrors([
                'activity_id' => 'No se encontró una actividad válida para registrar la participación.'
            ]);
        }

        $data = [
            'activity_id'    => (int) $activityId,
            'user_id'        => $userId,
            'description'    => $this->request->getVar('description'),
            'scheduled_date' => $this->request->getVar('scheduled_date'),
            'volunteer_count'=> $this->request->getVar('volunteer_count'),
            'custom_activity_name' => $this->request->getVar('custom_activity_name'),
            'activity_type' => $this->request->getVar('activity_type'),
            'group_name' => $this->request->getVar('group_name'),
            'location_name' => $this->request->getVar('location_name'),
            'location_address' => $this->request->getVar('location_address'),
            'duration_hours' => $this->request->getVar('duration_hours'),
            'beneficiaries_count' => $this->request->getVar('beneficiaries_count'),
            'testimonials' => $this->request->getVar('testimonials'),
            'evidence_links' => $this->request->getVar('evidence_links'),
            'status'         => 'pending'
        ];

        // Compatibilidad con esquemas legacy: solo intenta insertar columnas existentes.
        $tableColumns = $db->getFieldNames('impact_registrations');
        $data = array_intersect_key($data, array_flip($tableColumns));

        // Reglas de negocio: Heredar datos de la Causa Institucional
        if (!empty($data['activity_id'])) {
            $activity = $db->table('activities_catalog')
                ->where('id', (int) $data['activity_id'])
                ->get()
                ->getRowArray();

            if ($activity) {
                // Si la causa tiene horas por defecto y el usuario no especificó
                if (in_array('default_hours', $activityColumns, true)
                    && empty($data['duration_hours'])
                    && !empty($activity['default_hours'])) {
                    $data['duration_hours'] = $activity['default_hours'];
                }
                // Nota: Los beneficiarios de causas institucionales NO se heredan por voluntario. 
                // Son una cifra dura de la Causa en sí. Si no manda nada en comunitaria, se queda en null o 0.

            }
        }
        
        // Mantener compatibilidad si envían archivo, o usar enlace
        $evidenceFile = $this->request->getFile('evidence_image');
        if ($evidenceFile && $evidenceFile->isValid() && ! $evidenceFile->hasMoved()) {
            $newName = $evidenceFile->getRandomName();
            $evidenceFile->move(FCPATH . 'uploads', $newName);
            $data['evidence_image_url'] = base_url('uploads/' . $newName);
        }
        
        try {
            $now = date('Y-m-d H:i:s');
            if (in_array('created_at', $tableColumns, true) && empty($data['created_at'])) {
                $data['created_at'] = $now;
            }
            if (in_array('updated_at', $tableColumns, true) && empty($data['updated_at'])) {
                $data['updated_at'] = $now;
            }

            $inserted = $db->table('impact_registrations')->insert($data);
            if ($inserted) {
                return $this->respondCreated(['status' => 201, 'message' => 'Registro exitoso']);
            }

            $dbError = $db->error();
            if (!empty($dbError['message'])) {
                log_message('error', 'Registration insert DB error: {message}', ['message' => $dbError['message']]);
            }
        } catch (\Throwable $e) {
            log_message('error', 'Registration create failed: {message}', ['message' => $e->getMessage()]);
            return $this->failServerError('No fue posible guardar el registro.');
        }

        return $this->failServerError('No fue posible guardar el registro.');
    }
}
