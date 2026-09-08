<?php
// One-time migration runner - DELETE THIS FILE AFTER USE
// Place in api/public/migrate_run.php and access via browser

define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);
chdir(__DIR__);
require FCPATH . '../app/Config/Paths.php';
$paths = new Config\Paths();
require $paths->systemDirectory . '/Boot.php';

// Run migrate via CLI-style
$_SERVER['argv'] = ['spark', 'migrate', '--all'];
$_SERVER['argc'] = 3;
exit(CodeIgniter\Boot::bootSpark($paths));
?>
