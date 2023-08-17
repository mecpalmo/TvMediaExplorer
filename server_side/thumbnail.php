<?php
$path = $_GET['path'];

// Create a unique thumbnail filename
$thumbnailFilePath = '/mnt/external_drive/thumbnails' . md5($path) . '.jpg';

// Check if the thumbnail file already exists, if not, create it
if (!file_exists($thumbnailFilePath)) {
    // Generate the thumbnail using FFmpeg or any other tool you prefer
    // Replace "ffmpeg" with the actual path to your FFmpeg executable
    exec("ffmpeg -i $videoFilePath -ss 00:00:05 -vframes 1 $thumbnailFilePath");
}

// Set the appropriate header to indicate that the response is an image
header('Content-Type: image/jpeg');

// Output the thumbnail image
readfile($thumbnailFilePath);
?>
