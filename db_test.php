<?php
try {
    \ = new PDO('mysql:host=localhost;dbname=noodluis_somoscomunidad', 'noodluis_DEV_SC', 'UEix##DElOca');
    echo "DB Connected OK";
} catch (Exception \) {
    echo "DB Error: " . \->getMessage();
}
?>