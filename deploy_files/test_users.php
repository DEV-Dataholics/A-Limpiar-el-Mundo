<?php
$host = 'localhost';
$db   = 'somos_comunidad';
$user = 'noodluis_DEV_SC';
$pass = 'wXz%-m.INKs&';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    $stmt = $pdo->query('SELECT id, name, email, role_id, status FROM users');
    $results = $stmt->fetchAll();
    echo "<pre>";
    print_r($results);
    echo "</pre>";
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
