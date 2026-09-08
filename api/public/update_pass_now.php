<?php
$db = new mysqli("localhost", "noodluis_DEV_SC", "IXG,r%HoJ&Xp", "noodluis_somoscomunidad");
if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
}
// Update the password for id=1 to SomosComunidad$2026Secure
$password = 'SomosComunidad$2026Secure';
$hash = password_hash($password, PASSWORD_BCRYPT);
$db->query("UPDATE users SET password = '$hash' WHERE id = 1");
echo "Updated password for admin@somoscomunidad.org. Rows affected: " . $db->affected_rows;
?>
