<?php
/**
 * phpinfo_probe.php — Temporary PHP runtime diagnostic
 * Upload to server root, visit in browser, then DELETE immediately.
 * URL: https://somoscomunidad.dataholics.com.mx/phpinfo_probe.php
 */

// Quick DB connection test
$host = 'localhost';
$db   = 'somos_comunidad';
$user = 'noodluis_DEV_SC';
$pass = 'wXz%-m.INKs&';

echo '<style>body{font-family:monospace;padding:20px;background:#111;color:#eee;}</style>';
echo '<h2>PHP Version: ' . phpversion() . '</h2>';

// Check critical extensions
$required = ['intl', 'mbstring', 'openssl', 'pdo_mysql', 'mysqli', 'json', 'curl'];
echo '<h3>Required Extensions:</h3><ul>';
foreach ($required as $ext) {
    $loaded = extension_loaded($ext);
    echo '<li style="color:' . ($loaded ? 'lime' : 'red') . '">'
        . ($loaded ? '✅' : '❌') . ' ' . $ext . '</li>';
}
echo '</ul>';

// DB connection test
echo '<h3>Database Connection Test:</h3>';
try {
    $pdo = new PDO("mysql:host={$host};dbname={$db};charset=utf8mb4", $user, $pass);
    echo '<p style="color:lime">✅ DB connection OK — ' . $db . '</p>';

    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo '<p>Tables found: <b>' . implode(', ', $tables) . '</b></p>';
} catch (Exception $e) {
    echo '<p style="color:red">❌ DB connection FAILED: ' . htmlspecialchars($e->getMessage()) . '</p>';
}

// Check writable dirs
echo '<h3>Writable Directory Checks:</h3><ul>';
$dirs = [
    __DIR__ . '/api/writable',
    __DIR__ . '/api/writable/logs',
    __DIR__ . '/api/writable/cache',
    __DIR__ . '/api/writable/session',
];
foreach ($dirs as $dir) {
    $exists   = is_dir($dir);
    $writable = $exists && is_writable($dir);
    $label    = basename(dirname($dir)) . '/' . basename($dir);
    echo '<li style="color:' . ($writable ? 'lime' : ($exists ? 'orange' : 'red')) . '">'
        . ($writable ? '✅' : ($exists ? '⚠️ not writable' : '❌ missing')) . ' ' . $label . '</li>';
}
echo '</ul>';

echo '<hr><p style="color:orange"><b>⚠ DELETE THIS FILE IMMEDIATELY AFTER USE</b></p>';
// DO NOT include phpinfo() — avoid leaking server config publicly
