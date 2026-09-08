<?php
$passwords = [
    'UEix##DElOca',
    '~Ll3Qyv;p!-6',
    'b}%gI?we_2vz',
    'noodluis_DEV_SC',
    'admin'
];
foreach ($passwords as $p) {
    try {
        $mysqli = @new mysqli("localhost", "noodluis_DEV_SC", $p, "noodluis_somoscomunidad");
        if (!$mysqli->connect_error) {
            echo "SUCCESS: Password is $p";
            exit;
        }
    } catch (Exception $e) {}
}
echo "ALL FAILED.";
?>
