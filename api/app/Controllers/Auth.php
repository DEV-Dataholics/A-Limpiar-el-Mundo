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

        // Enviar correo de bienvenida institucional
        $this->sendWelcomeEmail($data['email'], (string) ($data['name'] ?? 'Voluntario(a)'));

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

            $key = getenv('JWT_SECRET') ?: env('JWT_SECRET', 'ALEM_2026_Secure_Jwt_Secret_Key_Dataholics_UnitedWay');

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
        $key = getenv('JWT_SECRET') ?: env('JWT_SECRET', 'ALEM_2026_Secure_Jwt_Secret_Key_Dataholics_UnitedWay');

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
        $email = trim((string) $this->request->getVar('email'));
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->failValidationErrors(['email' => 'Proporciona un correo electrónico válido.']);
        }

        $genericResponse = [
            'status'  => 200,
            'message' => 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.'
        ];

        try {
            $db = \Config\Database::connect();
            $user = $db->table('users')
                ->where('email', $email)
                ->get(1)
                ->getRowArray();

            if (!$user) {
                // Return generic response to prevent email enumeration
                return $this->respond($genericResponse);
            }

            // Invalidate any older tokens for this user
            $db->table('password_resets')->where('email', $email)->delete();

            // Generate secure token (32 bytes = 64 hex characters)
            $token = bin2hex(random_bytes(32));
            $now = date('Y-m-d H:i:s');
            $expiresAt = date('Y-m-d H:i:s', time() + 3600); // 1 hour validity

            $db->table('password_resets')->insert([
                'email'      => $email,
                'token'      => $token,
                'expires_at' => $expiresAt,
                'created_at' => $now,
            ]);

            // Construct Reset Link
            $baseURL = rtrim((string) (config('App')->baseURL ?: 'https://alimpiarelmundo.dataholics.com.mx'), '/');
            $resetLink = $baseURL . '/reset-password?token=' . urlencode($token);

            $userName = !empty($user['name']) ? htmlspecialchars($user['name']) : 'Voluntario(a)';

            // Prepare Email Content
            $emailService = \Config\Services::email();
            $emailService->setTo($email);
            $emailService->setSubject('Recuperación de contraseña - A Limpiar el Mundo 2026');

            $htmlMessage = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Recuperación de contraseña</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6FA; color: #1A2340; margin: 0; padding: 24px; }
    .card { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #D8E2F0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #0044B5; padding: 28px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
    .header p { margin: 6px 0 0; font-size: 12px; color: #FFBA00; font-weight: 600; letter-spacing: 0.5px; }
    .body { padding: 32px 28px; line-height: 1.6; font-size: 15px; }
    .btn-container { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; background-color: #0044B5; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .link-alt { word-break: break-all; font-size: 12px; color: #0044B5; background: #F4F6FA; padding: 12px; border-radius: 8px; margin-top: 16px; }
    .footer { border-top: 1px solid #E2E8F0; padding: 20px 28px; font-size: 12px; color: #718096; line-height: 1.5; background: #FAFAFC; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>A Limpiar el Mundo 2026</h1>
      <p>United Way Chihuahua · 35 Aniversario</p>
    </div>
    <div class="body">
      <p>Hola <strong>{$userName}</strong>,</p>
      <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en la plataforma de voluntariado e impacto social.</p>
      <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
      <div class="btn-container">
        <a href="{$resetLink}" class="btn" target="_blank">Restablecer mi Contraseña</a>
      </div>
      <p style="font-size: 13px; color: #4A5568;">
        Este enlace es de un solo uso y expirará en <strong>60 minutos</strong>.
      </p>
      <p style="font-size: 13px; color: #718096; margin-top: 24px;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:
      </p>
      <div class="link-alt">{$resetLink}</div>
    </div>
    <div class="footer">
      Si no solicitaste este cambio, no te preocupes: tu cuenta sigue protegida y puedes ignorar este mensaje.<br>
      © 2026 United Way Chihuahua / A Limpiar el Mundo.
    </div>
  </div>
</body>
</html>
HTML;

            $emailService->setMessage($htmlMessage);

            if (!@$emailService->send(false)) {
                // Log debug for administrators/developers in case of server sendmail issues
                log_message('error', 'Error enviando correo de recuperación a {email}: {debugger}', [
                    'email'    => $email,
                    'debugger' => $emailService->printDebugger(['headers'])
                ]);
            } else {
                log_message('info', 'Correo de recuperación enviado exitosamente a {email}', ['email' => $email]);
            }
        } catch (\Throwable $e) {
            log_message('error', 'Excepción en forgotPassword: {message}', ['message' => $e->getMessage()]);
        }

        return $this->respond($genericResponse);
    }

    public function validateResetToken()
    {
        $token = trim((string) $this->request->getVar('token'));
        if (empty($token)) {
            return $this->failValidationErrors(['token' => 'Token no proporcionado.']);
        }

        $db = \Config\Database::connect();
        $record = $db->table('password_resets')
            ->where('token', $token)
            ->get(1)
            ->getRowArray();

        if (!$record) {
            return $this->respond([
                'status'  => 404,
                'valid'   => false,
                'message' => 'El enlace de recuperación no es válido o ya fue utilizado.'
            ], 404);
        }

        if (strtotime($record['expires_at']) < time()) {
            return $this->respond([
                'status'  => 410,
                'valid'   => false,
                'message' => 'El enlace de recuperación ha expirado. Por favor solicita uno nuevo.'
            ], 410);
        }

        return $this->respond([
            'status' => 200,
            'valid'  => true,
            'email'  => $record['email'],
        ]);
    }

    public function resetPassword()
    {
        $rules = [
            'token'            => 'required',
            'password'         => 'required|min_length[8]',
            'password_confirm' => 'required|matches[password]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $token = trim((string) $this->request->getVar('token'));
        $password = (string) $this->request->getVar('password');

        $db = \Config\Database::connect();
        $record = $db->table('password_resets')
            ->where('token', $token)
            ->get(1)
            ->getRowArray();

        if (!$record) {
            return $this->failNotFound('El enlace de recuperación es inválido o ya fue utilizado.');
        }

        if (strtotime($record['expires_at']) < time()) {
            return $this->fail('El enlace de recuperación ha expirado. Solicita un nuevo enlace.', 410);
        }

        $email = $record['email'];
        $user = $db->table('users')->where('email', $email)->get(1)->getRowArray();
        if (!$user) {
            return $this->failNotFound('El usuario asociado a esta solicitud ya no existe.');
        }

        // Update password with secure bcrypt hash
        $newHash = password_hash($password, PASSWORD_BCRYPT);
        $db->table('users')
            ->where('id', $user['id'])
            ->update([
                'password'   => $newHash,
                'updated_at' => date('Y-m-d H:i:s')
            ]);

        // Consume/delete token to prevent replay
        $db->table('password_resets')->where('email', $email)->delete();

        return $this->respond([
            'status'  => 200,
            'message' => 'Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.'
        ]);
    }

    private function sendWelcomeEmail(string $email, string $name): void
    {
        try {
            $baseURL = rtrim((string) (config('App')->baseURL ?: 'https://alimpiarelmundo.dataholics.com.mx'), '/');
            $loginLink = $baseURL . '/login';
            $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');

            $emailService = \Config\Services::email();
            $emailService->setTo($email);
            $emailService->setSubject('¡Bienvenido(a) a A Limpiar el Mundo 2026!');

            $htmlMessage = <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Bienvenido a A Limpiar el Mundo</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4F6FA; color: #1A2340; margin: 0; padding: 24px; }
    .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #D8E2F0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #0044B5; padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #FFBA00; font-weight: 600; letter-spacing: 0.5px; }
    .body { padding: 32px 28px; line-height: 1.6; font-size: 15px; }
    .highlight-box { background: #F4F6FA; border-left: 4px solid #0044B5; border-radius: 0 12px 12px 0; padding: 16px; margin: 24px 0; font-size: 14px; }
    .highlight-box ul { margin: 8px 0 0; padding-left: 20px; }
    .highlight-box li { margin-bottom: 6px; }
    .btn-container { text-align: center; margin: 32px 0 24px; }
    .btn { display: inline-block; background-color: #0044B5; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 10px rgba(0,68,181,0.25); }
    .footer { border-top: 1px solid #E2E8F0; padding: 20px 28px; font-size: 12px; color: #718096; line-height: 1.5; background: #FAFAFC; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>A Limpiar el Mundo 2026</h1>
      <p>United Way Chihuahua · 35 Aniversario</p>
    </div>
    <div class="body">
      <p style="font-size: 17px; margin-top: 0;">¡Hola <strong>{$safeName}</strong>!</p>
      <p>
        Te damos una cálida bienvenida a la plataforma oficial de <strong>A Limpiar el Mundo 2026</strong>, impulsada por <strong>United Way Chihuahua</strong>.
      </p>
      <p>
        Tu cuenta ha sido creada exitosamente. A partir de este momento eres parte activa del movimiento de impacto social y comunitario más importante de nuestra región.
      </p>

      <div class="highlight-box">
        <strong>¿Qué puedes hacer en la plataforma?</strong>
        <ul>
          <li><strong>Explorar Causas:</strong> Conocer las actividades institucionales y comunitarias activas.</li>
          <li><strong>Registrar tu Impacto:</strong> Reportar tus horas de voluntariado, evidencias y beneficiarios atendidos.</li>
          <li><strong>Métricas en Vivo:</strong> Ver el avance del impacto acumulado por empresas, plantas y comunidades.</li>
        </ul>
      </div>

      <p style="font-size: 14px; color: #4A5568;">
        Tu correo de acceso registrado es: <strong style="color: #0044B5;">{$email}</strong>
      </p>

      <div class="btn-container">
        <a href="{$loginLink}" class="btn" target="_blank">Ingresar a la Plataforma</a>
      </div>
    </div>
    <div class="footer">
      <strong>United Way Chihuahua</strong> · Fondos Unidos de Chihuahua, A.C.<br>
      Juntos multiplicamos el impacto en nuestra comunidad.<br>
      © 2026 A Limpiar el Mundo.
    </div>
  </div>
</body>
</html>
HTML;

            $emailService->setMessage($htmlMessage);
            if (!@$emailService->send(false)) {
                log_message('error', 'Error enviando correo de bienvenida a {email}: {debugger}', [
                    'email'    => $email,
                    'debugger' => $emailService->printDebugger(['headers'])
                ]);
            } else {
                log_message('info', 'Correo de bienvenida enviado exitosamente a {email}', ['email' => $email]);
            }
        } catch (\Throwable $e) {
            log_message('error', 'Excepción enviando correo de bienvenida: {message}', ['message' => $e->getMessage()]);
        }
    }
}
