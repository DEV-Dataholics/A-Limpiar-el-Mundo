<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
try {
    $mysqli = new mysqli('localhost', 'noodluis_DEV_SC', '', 'noodluis_somoscomunidad');
    if ($mysqli->connect_error) {
        echo "Failed with empty : " . $mysqli->connect_error . "\n";
    } else {
        echo "Success with empty\n";
    }
} catch (Exception $e) {
    echo "Exception with empty: " . $e->getMessage() . "\n";
}
try {
    $mysqli = new mysqli('localhost', 'root', '', 'noodluis_somoscomunidad');
    if ($mysqli->connect_error) {
        echo "Failed with root empty : " . $mysqli->connect_error . "\n";
    } else {
        echo "Success with root empty\n";
    }
} catch (Exception $e) {
    echo "Exception with root empty: " . $e->getMessage() . "\n";
}
