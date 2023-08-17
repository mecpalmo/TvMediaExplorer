<?php
//filetree.php

$basePath = '/mnt/external_drive';

$path = isset($_GET['path']) ? $_GET['path'] : '';

$files = scandir($basePath . $path);

$response = [];
foreach ($files as $file) {
  if ($file !== '.' && $file !== '..') {
    $filePath = $path . '/' . $file;
    $fileInfo = [
      'name' => $file,
      'path' => $filePath,
      'type' => is_dir($basePath . $filePath) ? 'directory' : 'file',
      'mediaType' => getMediaType($file)
    ];
    $response[] = $fileInfo;
  }
}

header('Content-Type: application/json');
echo json_encode($response);

function getMediaType($fileName) {
  $video_extensions = array("mp4", "avi");
  $image_extensions = array("jpg", "png");
  $extension = strtolower(substr($fileName, strrpos($fileName, '.') + 1));
  if (in_array($extension, $video_extensions, false)) {
    return "video";
  }
  if (in_array($extension, $image_extensions, false)) {
    return "image";
  }
  return 'other';
}

?>
