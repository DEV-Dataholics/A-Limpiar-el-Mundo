<?php
/**
 * admin_setup.php — One-time admin user creator
 * Uses plain PDO (no CodeIgniter bootstrap, no intl extension needed).
 * DELETE THIS FILE IMMEDIATELY after use.
 */

// Read credentials from CI .env manually (avoids parse_ini_file issues with # in password)
$envPath = __DIR__ . '/api/.env';
$config  = [];

if (file_exists($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (!str_contains($line, '=')) continue;
        [$key, $val] = explode('=', $line, 2);
        $config[trim($key)] = trim($val);
    }
}

$host = $config['database.default.hostname'] ?? 'localhost';
$db   = $config['database.default.database'] ?? '';
$user = $config['database.default.username'] ?? '';
$pass = $config['database.default.password'] ?? '';

if (!$db || !$user) {
    die('<b>ERROR:</b> Could not read database credentials from api/.env');
}

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$db};charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    die('<b>DB connection failed:</b> ' . htmlspecialchars($e->getMessage()));
}

// Check if admin already exists
$check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$check->execute(['admin@somoscomunidad.org']);

if ($check->fetch()) {
    echo '<p style="color:orange">⚠ Admin user already exists (admin@somoscomunidad.org). Nothing was changed.</p>';
} else {
    $hash = password_hash('Admin1234!', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("
        INSERT INTO users (role_id, name, last_name, email, password, created_at, updated_at)
        VALUES (1, 'Administrador', 'Sistema', 'admin@somoscomunidad.org', ?, NOW(), NOW())
    ");
    $stmt->execute([$hash]);
    echo '<p style="color:green">✅ Admin user created successfully!</p>';
    echo '<p><b>Email:</b> admin@somoscomunidad.org</p>';
    echo '<p><b>Password:</b> Admin1234!</p>';
    echo '<p style="color:red"><b>⚠ DELETE THIS FILE NOW and change the password after first login.</b></p>';
}
