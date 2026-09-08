<?php
/**
 * fix_permissions.php — Recursively fixes permissions on api/vendor/
 * Sets directories to 755 and PHP files to 644.
 * UPLOAD TO SERVER ROOT. DELETE AFTER USE.
 */

$vendorPath = __DIR__ . '/api/vendor';

if (! is_dir($vendorPath)) {
    die("ERROR: Cannot find $vendorPath");
}

$dirCount  = 0;
$fileCount = 0;
$errors    = [];

function fixPerms(string $path, int &$dirCount, int &$fileCount, array &$errors): void
{
    $items = scandir($path);
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
            // Files: set to 644
            if (! chmod($full, 0644)) {
                $errors[] = "chmod 644 FAILED: $full";
            } else {
                $fileCount++;
            }
        }
    }
}

echo '<style>body{font-family:monospace;background:#111;color:#eee;padding:20px;}</style>';
echo '<h2>🔧 Fixing vendor/ permissions...</h2>';

// Also fix the vendor root itself
chmod($vendorPath, 0755);
fixPerms($vendorPath, $dirCount, $fileCount, $errors);

echo "<p style='color:lime'>✅ Directories chmod 755: <b>$dirCount</b></p>";
echo "<p style='color:lime'>✅ Files chmod 644: <b>$fileCount</b></p>";

if (count($errors) > 0) {
    echo "<p style='color:red'>❌ Errors (" . count($errors) . "):</p><pre>" . implode("\n", array_slice($errors, 0, 20)) . "</pre>";
} else {
    echo "<p style='color:lime'>✅ No errors!</p>";
}

echo "<hr><p style='color:orange'>⚠ DELETE THIS FILE NOW</p>";
