<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// Add OPTIONS catch-all for CORS preflight
$routes->options('(:any)', static function () {
    $origin = service('request')->getHeaderLine('Origin') ?: '*';
    $response = response();
    $response->setStatusCode(204);
    $response->setHeader('Access-Control-Allow-Origin', $origin);
    $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    $response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return $response;
});

// Definición unificada de rutas API
$registerAppRoutes = static function ($routes) {
    // Auth
    $routes->post('auth/register', 'Auth::register');
    $routes->get('auth/fix-password', 'Auth::fixAdminPassword');
    $routes->post('auth/login', 'Auth::login');
    $routes->put('auth/profile', 'Auth::updateProfile');
    $routes->post('auth/forgot-password', 'Auth::forgotPassword');
    $routes->post('auth/reset-password', 'Auth::resetPassword');
    $routes->get('users', 'Auth::listUsers');

    $routes->get('corporates/search', 'CorporateController::search');
    $routes->get('public-metrics', 'Admin\Metrics::index');

    // Resources
    $routes->get('activities/reset', 'Activities::reset');
    $routes->resource('activities');

    // Registrations
    $routes->get('registrations/my-events', 'Registrations::myEvents');
    $routes->resource('registrations');

    // Admin Routes (Protegidas por AdminAuthFilter)
    $routes->group('admin', ['filter' => 'adminauth'], static function ($routes) {
        $routes->get('metrics', 'Admin\Metrics::index');
        $routes->get('reports/mobilizations', 'Admin\Registrations::mobilizationReports');
        $routes->resource('activities', ['controller' => 'Admin\Activities']);
        $routes->resource('users', ['controller' => 'Admin\Users', 'only' => ['index', 'delete']]);
        $routes->resource('registrations', ['controller' => 'Admin\Registrations', 'only' => ['index', 'update', 'delete']]);
    });
};

// Rutas directas (producción con rewrite .htaccess o llamadas directas)
$registerAppRoutes($routes);

// Rutas con prefijo api/ (desarrollo local y consumo directo)
$routes->group('api', $registerAppRoutes);
