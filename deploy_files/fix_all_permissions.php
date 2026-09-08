<?php
/**
 * fix_all_permissions.php — Recursively fixes permissions on ENTIRE api/ tree
 * Sets directories to 755 and files to 644.
 * UPLOAD TO SERVER ROOT. DELETE AFTER USE.
 */

// Fix both vendor/ AND app/ AND writable/
$roots = [
    __DIR__ . '/api/app',
    __DIR__ . '/api/vendor',
    __DIR__ . '/api/writable',
];

$dirCount  = 0;
$fileCount = 0;
$errors    = [];

function fixPerms(string $path, int &$dirCount, int &$fileCount, array &$errors): void
{
    if (! is_dir($path)) return;
    $items = @scandir($path);
    if ($items === false) {
        $errors[] = "scandir FAILED: $path";
        return;
    }
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $full = $path . '/' . $item;

        if (is_dir($full)) {
            if (! chmod($full, 0755)) {
                $errors[] = "chmod 755 FAILED: $full";
            } else {
                $dirCount++;
            }
            fixPerms($full, $dirCount, $fileCount, $errors);
        } else {
            if (! chmod($full, 0644)) {
                $errors[] = "chmod 644 FAILED: $full";
            } else {
                $fileCount++;
            }
        }
    }
}

echo '<style>body{font-family:monospace;background:#111;color:#eee;padding:20px;}</style>';
echo '<h2>🔧 Fixing ALL api/ permissions...</h2>';

foreach ($roots as $root) {
    if (is_dir($root)) {
        chmod($root, 0755);
        echo "<p>Processing: <b>$root</b></p>";
        flush();
        fixPerms($root, $dirCount, $fileCount, $errors);
    } else {
        echo "<p style='color:orange'>⚠ Not found: $root</p>";
    }
}

echo "<p style='color:lime'>✅ Directories chmod 755: <b>$dirCount</b></p>";
echo "<p style='color:lime'>✅ Files chmod 644: <b>$fileCount</b></p>";

if (count($errors) > 0) {
    echo "<p style='color:red'>❌ Errors (" . count($errors) . "):</p><pre>" . implode("\n", array_slice($errors, 0, 30)) . "</pre>";
} else {
    echo "<p style='color:lime'>✅ No errors!</p>";
}

echo "<hr><p style='color:orange'>⚠ DELETE THIS FILE NOW</p>";
