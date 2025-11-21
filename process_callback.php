<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set response header
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Path to callbacks log file
$callbacksFile = __DIR__ . '/callbacks.json';
$logsDir = __DIR__ . '/logs';

// Create logs directory if it doesn't exist
if (!is_dir($logsDir)) {
    mkdir($logsDir, 0777, true);
}

// Log file for debugging
$logFile = $logsDir . '/callback_' . date('Y-m-d') . '.log';

function log_message($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Handle GET request - retrieve all callbacks
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    log_message("GET request received");
    
    if (isset($_GET['action']) && $_GET['action'] === 'get_all') {
        if (file_exists($callbacksFile)) {
            $content = file_get_contents($callbacksFile);
            $callbacks = json_decode($content, true);
            echo json_encode($callbacks ?: []);
        } else {
            echo json_encode([]);
        }
        exit;
    }
}

// Handle POST request - save callback
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    log_message("POST request received");
    
    $data = $_POST;
    
    log_message("Form data: " . json_encode($data));
    
    // Validate required fields
    if (empty($data['fullName']) || empty($data['mobileNumber']) || empty($data['email'])) {
        log_message("Validation failed - missing required fields");
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
        'status' => 'pending',
        'notes' => ''
    ];
    
    log_message("Callback created: " . json_encode($callback));
    
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
    } else {
        log_message("callbacks.json does not exist, creating new file");
    }
    
    log_message("Existing callbacks: " . count($callbacks));
    
    // Add new callback
    $callbacks[] = $callback;
    
    // Write back to file with proper permissions
    $json = json_encode($callbacks, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    
    // Ensure file directory is writable
    $dir = dirname($callbacksFile);
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
    
    // Try to write the file
    $writeResult = file_put_contents($callbacksFile, $json, LOCK_EX);
    
    if ($writeResult !== false) {
        // Make sure file is readable/writable
        chmod($callbacksFile, 0666);
        
        log_message("Callback saved successfully. File size: " . filesize($callbacksFile) . " bytes");
        
        // Send email notification (optional)
        send_email_notification($callback);
        
        echo json_encode([
            'success' => true,
            'message' => 'Callback request received successfully! We will contact you soon.',
            'id' => $callback['id']
        ]);
    } else {
        log_message("ERROR: Failed to write to callbacks.json");
        log_message("File path: " . $callbacksFile);
        log_message("Directory writable: " . (is_writable(dirname($callbacksFile)) ? 'YES' : 'NO'));
        
        echo json_encode([
            'success' => false,
            'message' => 'Error saving callback. File write failed. Check permissions.'
        ]);
    }
    exit;
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
        <tr><td><b>Message</b></td><td>" . nl2br($callback['message']) . "</td></tr>
    </table>
    </body></html>
    ";
    
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: noreply@abhyuday.com\r\n";
    
    // Uncomment to enable email sending (requires mail server configured)
    // mail($to, $subject, $message, $headers);
}

log_message("Script ended");
?>


