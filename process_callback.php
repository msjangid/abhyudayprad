<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to users
ini_set('log_errors', 1);

// Set response header
header('Content-Type: application/json');

// Get form data
$data = $_POST;

// Validate required fields
if (empty($data['fullName']) || empty($data['mobileNumber']) || empty($data['email'])) {
    echo json_encode(['success' => false, 'message' => 'Please fill all required fields']);
    exit;
}

// Sanitize input data
$callback = [
    'id' => uniqid('CB_', true),
    'timestamp' => date('Y-m-d H:i:s'),
    'date' => date('Y-m-d'),
    'fullName' => sanitize_input($data['fullName']),
    'mobileNumber' => sanitize_input($data['mobileNumber']),
    'email' => sanitize_input($data['email']),
    'businessName' => sanitize_input($data['businessName'] ?? ''),
    'requirement' => sanitize_input($data['requirement'] ?? ''),
    'message' => sanitize_input($data['message'] ?? ''),
    'status' => 'pending'
];

// Path to callbacks log file
$callbacksFile = __DIR__ . '/callbacks.json';

// Read existing callbacks
$callbacks = [];
if (file_exists($callbacksFile)) {
    $content = file_get_contents($callbacksFile);
    if (!empty($content)) {
        $callbacks = json_decode($content, true);
        if (!is_array($callbacks)) {
            $callbacks = [];
        }
    }
}

// Add new callback
$callbacks[] = $callback;

// Write back to file
if (file_put_contents($callbacksFile, json_encode($callbacks, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX)) {
    // Send email notification
    send_email_notification($callback);
    
    echo json_encode([
        'success' => true,
        'message' => 'Callback request received successfully! We will contact you soon.',
        'id' => $callback['id']
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error saving callback request. Please try again.'
    ]);
}

// Sanitize input function
function sanitize_input($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Send email notification
function send_email_notification($callback) {
    $to = 'abhyuday220523@gmail.com';
    $subject = 'New Callback Request - ' . $callback['fullName'];
    
    $message = "
    <html><body>
    <h2>New Callback Request</h2>
    <table border='1' cellpadding='10'>
        <tr><td><b>ID</b></td><td>" . $callback['id'] . "</td></tr>
        <tr><td><b>Date & Time</b></td><td>" . $callback['timestamp'] . "</td></tr>
        <tr><td><b>Full Name</b></td><td>" . $callback['fullName'] . "</td></tr>
        <tr><td><b>Mobile Number</b></td><td>" . $callback['mobileNumber'] . "</td></tr>
        <tr><td><b>Email</b></td><td>" . $callback['email'] . "</td></tr>
        <tr><td><b>Business Name</b></td><td>" . $callback['businessName'] . "</td></tr>
        <tr><td><b>Requirement</b></td><td>" . $callback['requirement'] . "</td></tr>
        <tr><td><b>Message</b></td><td>" . $callback['message'] . "</td></tr>
        <tr><td><b>Status</b></td><td>" . $callback['status'] . "</td></tr>
    </table>
    </body></html>
    ";
    
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: noreply@abhyuday.com\r\n";
    
    // Uncomment to enable email sending
    // mail($to, $subject, $message, $headers);
}
?>
