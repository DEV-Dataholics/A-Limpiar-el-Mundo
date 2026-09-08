<?php
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

$hash = password_hash('Admin1234!', PASSWORD_DEFAULT);
$stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = 'admin@somoscomunidad.org'");
$stmt->execute([$hash]);

echo '<p style="color:green">✅ Admin password forced reset to Admin1234!</p>';
