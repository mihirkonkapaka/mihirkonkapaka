<?php
header('Content-Type: application/json');

// Read JSON input
$data = json_decode(file_get_contents('php://input'), true);
$url = $data['image_url'] ?? '';
$desc = $data['description'] ?? '';
$questions = $data['questions'] ?? '';

// Setup your DB credentials
$db = new mysqli('localhost', 'DB_USER', '', 'default_db');
if ($db->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection error']);
    exit;
}

$stmt = $db->prepare("INSERT INTO landsat_questions (image_url, description, questions, created_at) VALUES (?, ?, ?, NOW())");
$stmt->bind_param("sss", $url, $desc, $questions);
if ($stmt->execute()) {
    echo json_encode(['status' => 'saved']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'DB insert failed']);
}
$stmt->close();
$db->close();
