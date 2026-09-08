<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
$passwords = ['VX^uU~Tn7*w=', 'IXG,r%HoJ&Xp'];
foreach ($passwords as $p) {
    try {
        $mysqli = new mysqli('localhost', 'noodluis_DEV_SC', $p, 'noodluis_somoscomunidad');
        if ($mysqli->connect_error) {
            echo "Failed with $p : " . $mysqli->connect_error . "\n";
        } else {
            echo "Success with $p\n";
        }
    } catch (Exception $e) {
        echo "Exception with $p: " . $e->getMessage() . "\n";
    }
}
