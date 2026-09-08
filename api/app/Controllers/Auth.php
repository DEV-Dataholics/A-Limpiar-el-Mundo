<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth extends ResourceController
{
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

    private function cleanUtf8(?string $value): string
    {
        if ($value === null || $value === '') {
            return '';
        }

        // Avoid hard dependency on mbstring in shared-host environments.
        if (preg_match('//u', $value) === 1) {
            return $value;
        }

        if (function_exists('iconv')) {
            $fixed = @iconv('Windows-1252', 'UTF-8//IGNORE', $value);
            if (is_string($fixed) && $fixed !== '') {
                return $fixed;
            }
        }

        return utf8_encode($value);
    }

    public function fixAdminPassword()
    {
        $hash = password_hash('SomosComunidad$2026Secure', PASSWORD_BCRYPT);
        $db = \Config\Database::connect();
        $db->table('users')->where('email', 'admin@somoscomunidad.org')->update(['password' => $hash]);
        return $this->respond(['status' => 'fixed']);
    }

    public function register()
    {
        $rules = [
            'name'         => 'required|max_length[150]',
            'last_name'    => 'required|max_length[100]',
            'age'          => 'required|numeric|greater_than[0]',
            'email'        => 'required|valid_email|is_unique[users.email]',
            'phone'        => 'required|numeric',
            'password'     => 'required|min_length[8]',
            'state'        => 'required',
            'municipality' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $userModel = new UserModel();
        
        $data = [
            'name'         => $this->request->getVar('name'),
            'last_name'    => $this->request->getVar('last_name'),
            'age'          => $this->request->getVar('age'),
            'email'        => $this->request->getVar('email'),
            'phone'        => $this->request->getVar('phone'),
            'state'        => $this->request->getVar('state'),
            'municipality' => $this->request->getVar('municipality'),
            'password'     => password_hash($this->request->getVar('password'), PASSWORD_DEFAULT)
        ];

        $userModel->insert($data);
        $userId = $userModel->getInsertID();

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Usuario registrado exitosamente',
            'data'    => ['id' => $userId]
        ]);
    }

    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        try {
            // Use Query Builder to avoid hard failures when legacy DBs miss soft-delete columns.
            $db = \Config\Database::connect();
            $user = $db->table('users')
                ->where('email', $this->request->getVar('email'))
                ->get(1)
                ->getRowArray();

            if (!$user || !isset($user['password']) || !password_verify($this->request->getVar('password'), $user['password'])) {
                return $this->failUnauthorized('Credenciales inválidas');
            }

            $key = getenv('JWT_SECRET');
            if (!$key) {
                return $this->failServerError('JWT_SECRET no configurado');
            }

            $this->ensureJwtClassesLoaded();

            $roleId = isset($user['role_id']) ? (int) $user['role_id'] : 2;
            $safeUser = [
                'id'                => (int) ($user['id'] ?? 0),
                'name'              => $this->cleanUtf8($user['name'] ?? ''),
                'last_name'         => $this->cleanUtf8($user['last_name'] ?? ''),
                'age'               => isset($user['age']) ? (int) $user['age'] : null,
                'email'             => $this->cleanUtf8($user['email'] ?? ''),
                'organization_name' => $this->cleanUtf8($user['organization_name'] ?? ''),
                'state'             => $this->cleanUtf8($user['state'] ?? ''),
                'municipality'      => $this->cleanUtf8($user['municipality'] ?? ''),
                'phone'             => $this->cleanUtf8($user['phone'] ?? ''),
                'plant_id'          => isset($user['plant_id']) ? (int) $user['plant_id'] : null,
                'division_id'       => isset($user['division_id']) ? (int) $user['division_id'] : null,
                'role_id'           => $roleId
            ];

            $payload = [
                'sub' => $safeUser['id'],
                'role_id' => $roleId,
                'iat' => time(),
                'exp' => time() + 86400 // 24h
            ];
            $jwt = JWT::encode($payload, $key, 'HS256');

            return $this->respond([
                'status'  => 200,
                'message' => 'Login exitoso',
                'data'    => [
                    'user' => $safeUser,
                    'token' => $jwt
                ]
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'Auth::login failed: {message}', ['message' => $e->getMessage()]);
            return $this->failServerError('Error interno al iniciar sesión. Verifica configuración de base de datos y JWT.');
        }
    }

    public function updateProfile()
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

        $this->ensureJwtClassesLoaded();

        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userId = $decoded->sub;
        } catch (\Exception $e) {
            return $this->failUnauthorized('Token inválido o expirado.');
        }

        $userModel = new UserModel();
        $user = $userModel->find($userId);

        if (!$user) {
            return $this->failNotFound('Usuario no encontrado.');
        }

        $data = [
            'name'              => $this->request->getVar('name'),
            'last_name'         => $this->request->getVar('last_name'),
            'age'               => $this->request->getVar('age'),
            'organization_name' => $this->request->getVar('organization_name'),
            'state'             => $this->request->getVar('state'),
            'municipality'      => $this->request->getVar('municipality'),
            'phone'             => $this->request->getVar('phone'),
            'plant_id'          => $this->request->getVar('plant_id') ?: null,
            'division_id'       => $this->request->getVar('division_id') ?: null,
        ];

        if ($userModel->update($userId, $data)) {
            // Refetch user to return updated data
            $user = $userModel->find($userId);
            return $this->respond([
                'status'  => 200,
                'message' => 'Perfil actualizado exitosamente',
                'data'    => [
                    'user' => [
                        'id'                => $user['id'],
                        'name'              => $user['name'],
                        'last_name'         => $user['last_name'],
                        'age'               => $user['age'],
                        'email'             => $user['email'],
                        'organization_name' => $user['organization_name'] ?? '',
                        'state'             => $user['state'] ?? '',
                        'municipality'      => $user['municipality'] ?? '',
                        'phone'             => $user['phone'] ?? '',
                        'plant_id'          => $user['plant_id'] ?? null,
                        'division_id'       => $user['division_id'] ?? null,
                        'role_id'           => $user['role_id']
                    ]
                ]
            ]);
        }

        return $this->failValidationErrors($userModel->errors());
    }

    public function listUsers()
    {
        $userModel = new UserModel();
        $users = $userModel->findAll();
        return $this->respond($users);
    }

    public function forgotPassword()
    {
        // Mocked for now - we would send an email with a reset token here.
        return $this->respond(['status' => 200, 'message' => 'Si el correo existe, se enviarán instrucciones de recuperación.']);
    }

    public function resetPassword()
    {
        // Mocked for now - we would validate token and update password.
        return $this->respond(['status' => 200, 'message' => 'Contraseña actualizada.']);
    }
}
