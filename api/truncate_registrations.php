<?php

// Load CodeIgniter bootstrapper
require_once 'app/Config/Paths.php';
$paths = new Config\Paths();
require_once $paths->systemDirectory . '/Boot.php';
\CodeIgniter\Boot::bootWeb($paths);

$db = \Config\Database::connect();

try {
    $db->query('SET FOREIGN_KEY_CHECKS = 0');
    $db->query('TRUNCATE TABLE impact_registrations');
    $db->query('SET FOREIGN_KEY_CHECKS = 1');
    echo "SUCCESS: impact_registrations truncated.";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
