<?php
$dir = dirname(__DIR__);
echo "Directory listing for $dir:<br>";
$files = scandir($dir);
foreach ($files as $file) {
    echo $file . "<br>";
}
?>
