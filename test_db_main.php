<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
$passwords = ['b}%gI?we_2vz', '~Ll3Qyv;p!-6'];
foreach ($passwords as $p) {
    try {
        $mysqli = new mysqli('localhost', 'noodluis', $p, 'noodluis_somoscomunidad');
        if ($mysqli->connect_error) {
            echo "Failed with $p : " . $mysqli->connect_error . "\n";
        } else {
            echo "Success with $p\n";
        }
    } catch (Exception $e) {
        echo "Exception with $p: " . $e->getMessage() . "\n";
    }
}
