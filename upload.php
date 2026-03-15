<?php
// Upload image
require_once __DIR__ . '/config.php';

if (empty($_FILES['image']) || empty($_POST['field'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing image or field']);
    exit;
}

$clientId = CLIENT_ID;
$field = $_POST['field'];
$file = $_FILES['image'];

// Validate
$allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
if (!in_array($file['type'], $allowed)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type. Allowed: JPG, PNG, WebP, SVG']);
    exit;
}
if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'File too large. Max 5MB']);
    exit;
}

// Save file
$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = $clientId . '_' . $field . '_' . time() . '.' . $ext;
$path = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $path)) {
    http_response_code(500);
    echo json_encode(['error' => 'Upload failed']);
    exit;
}

// Save to DB
$relativePath = 'uploads/' . $filename;
$stmt = $pdo->prepare('INSERT INTO images (client_id, field, filename, path) VALUES (?, ?, ?, ?)');
$stmt->execute([$clientId, $field, $file['name'], $relativePath]);

// Also update content table
$stmt = $pdo->prepare('INSERT INTO content (client_id, section, field, value, type)
    VALUES (?, ?, ?, ?, "image")
    ON DUPLICATE KEY UPDATE value = VALUES(value), type = "image"');
$stmt->execute([$clientId, 'images', $field, $relativePath]);

echo json_encode(['success' => true, 'path' => $relativePath]);
