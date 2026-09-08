<?php
$zips = ['firebase.zip', 'composer_autoload.zip'];
foreach ($zips as $file) {
    $zip = new ZipArchive;
    if ($zip->open($file) === TRUE) {
        $zip->extractTo(__DIR__ . '/../vendor/');
        $zip->close();
        echo "Extracted $file successfully.<br>";
    } else {
        echo "Failed to open $file.<br>";
    }
}
?>
