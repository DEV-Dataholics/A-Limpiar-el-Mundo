<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use App\Models\UserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AdminAuthFilter implements FilterInterface
{
    private function ensureJwtClassesLoaded(): void
    {
        if (!class_exists('Firebase\\JWT\\JWT')) {
            @require_once ROOTPATH . 'vendor/firebase/php-jwt/src/JWT.php';
        }
        if (!class_exists('Firebase\\JWT\\Key')) {
            @require_once ROOTPATH . 'vendor/firebase/php-jwt/src/Key.php';
        }
    }

    public function before(RequestInterface $request, $arguments = null)
    {
        $header = $request->getHeaderLine('Authorization');
        
        if (!$header) {
            return \Config\Services::response()
                ->setJSON(['error' => 'No autorizado. Token requerido.'])
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
        }

        $token = null;

        if (!empty($header)) {
            if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
                $token = $matches[1];
            }
        }

        if (is_null($token) || empty($token)) {
            return \Config\Services::response()
                ->setJSON(['error' => 'Acceso denegado. Token no válido.'])
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
        }

        try {
            $this->ensureJwtClassesLoaded();

            $key = getenv('JWT_SECRET');
            if (!$key) {
                return \Config\Services::response()
                    ->setJSON(['error' => 'JWT_SECRET no configurado'])
                    ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
            }
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            if (!isset($decoded->sub) || !isset($decoded->role_id) || !isset($decoded->exp)) {
                return \Config\Services::response()
                    ->setJSON(['error' => 'Token JWT inválido'])
                    ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
            }
            if ($decoded->exp < time()) {
                return \Config\Services::response()
                    ->setJSON(['error' => 'Token expirado'])
                    ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
            }
            if ($decoded->role_id != 1) {
                return \Config\Services::response()
                    ->setJSON(['error' => 'Acceso denegado. Se requieren privilegios de administrador.'])
                    ->setStatusCode(ResponseInterface::HTTP_FORBIDDEN);
            }
        } catch (\Exception $ex) {
            return \Config\Services::response()
                ->setJSON(['error' => 'Acceso denegado. Error procesando token.'])
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No hacer nada aquí
    }
}
