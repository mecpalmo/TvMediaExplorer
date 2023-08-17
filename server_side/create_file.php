<?php
$fileContent = "This is a test file.";
$filePath = './thumbnails/test.txt';

file_put_contents($filePath, $fileContent);

echo "File created successfully!";
?>
