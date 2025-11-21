<?php
/**
 * Setup & Diagnostic file for callbacks system
 * Visit in browser: http://localhost/abhyuday/setup_callbacks.php
 */

$baseDir = __DIR__;
$callbacksFile = $baseDir . '/callbacks.json';
$logsDir = $baseDir . '/logs';

echo '<style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .section { background: white; margin: 20px 0; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .success { color: #155724; background: #d4edda; padding: 10px; border-radius: 3px; margin: 10px 0; }
    .error { color: #721c24; background: #f8d7da; padding: 10px; border-radius: 3px; margin: 10px 0; }
    .warning { color: #856404; background: #fff3cd; padding: 10px; border-radius: 3px; margin: 10px 0; }
    .info { color: #0c5460; background: #d1ecf1; padding: 10px; border-radius: 3px; margin: 10px 0; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    table td, table th { padding: 10px; border: 1px solid #ddd; text-align: left; }
    table th { background: #f5f5f5; font-weight: bold; }
    .btn { display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 3px; text-decoration: none; margin: 5px; }
    .btn:hover { background: #5568d3; }
    h2 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
</style>';

echo '<div class="section">';
echo '<h1>🔧 Callback System - Setup & Diagnostics</h1>';
echo '</div>';

// Check base directory
echo '<div class="section">';
echo '<h2>📁 Directory Status</h2>';
echo '<table>';
echo '<tr><th>Item</th><th>Path</th><th>Status</th></tr>';

// Base directory
$baseExists = is_dir($baseDir);
echo '<tr>';
echo '<td>Base Directory</td>';
echo '<td><code>' . $baseDir . '</code></td>';
echo '<td>' . ($baseExists ? '<div class="success">✓ Exists</div>' : '<div class="error">✗ Not found</div>') . '</td>';
echo '</tr>';

// Logs directory
$logsExists = is_dir($logsDir);
echo '<tr>';
echo '<td>Logs Directory</td>';
echo '<td><code>' . $logsDir . '</code></td>';
if ($logsExists) {
    echo '<td><div class="success">✓ Exists</div></td>';
} else {
    $created = mkdir($logsDir, 0777, true);
    if ($created) {
        echo '<td><div class="success">✓ Created</div></td>';
    } else {
        echo '<td><div class="error">✗ Cannot create</div></td>';
    }
}
echo '</tr>';

echo '</table>';
echo '</div>';

// Check callbacks.json file
echo '<div class="section">';
echo '<h2>📝 Callbacks File Status</h2>';

if (file_exists($callbacksFile)) {
    echo '<div class="success">✓ File exists: ' . $callbacksFile . '</div>';
    echo '<table>';
    echo '<tr><th>Property</th><th>Value</th></tr>';
    echo '<tr><td>File Size</td><td>' . filesize($callbacksFile) . ' bytes</td></tr>';
    echo '<tr><td>Readable</td><td>' . (is_readable($callbacksFile) ? '<div class="success">✓ Yes</div>' : '<div class="error">✗ No</div>') . '</td></tr>';
    echo '<tr><td>Writable</td><td>' . (is_writable($callbacksFile) ? '<div class="success">✓ Yes</div>' : '<div class="error">✗ No</div>') . '</td></tr>';
    echo '<tr><td>Permissions</td><td>' . substr(sprintf('%o', fileperms($callbacksFile)), -4) . '</td></tr>';
    echo '</table>';
    
    // Show contents
    $content = file_get_contents($callbacksFile);
    $data = json_decode($content, true);
    echo '<h3>File Contents (' . count($data) . ' callbacks):</h3>';
    echo '<pre style="background: #f5f5f5; padding: 10px; border-radius: 3px; overflow-x: auto;">' . json_encode($data, JSON_PRETTY_PRINT) . '</pre>';
} else {
    echo '<div class="warning">⚠ File does not exist: ' . $callbacksFile . '</div>';
    echo '<p>Creating file...</p>';
    
    $created = file_put_contents($callbacksFile, json_encode([], JSON_PRETTY_PRINT));
    if ($created !== false) {
        chmod($callbacksFile, 0666);
        echo '<div class="success">✓ File created successfully!</div>';
        echo '<div class="info">File permissions set to 0666 (readable and writable)</div>';
    } else {
        echo '<div class="error">✗ Failed to create file. Check directory permissions.</div>';
    }
}

echo '</div>';

// Check PHP settings
echo '<div class="section">';
echo '<h2>⚙️ PHP Configuration</h2>';
echo '<table>';
echo '<tr><th>Setting</th><th>Value</th></tr>';
echo '<tr><td>PHP Version</td><td>' . phpversion() . '</td></tr>';
echo '<tr><td>upload_max_filesize</td><td>' . ini_get('upload_max_filesize') . '</td></tr>';
echo '<tr><td>post_max_size</td><td>' . ini_get('post_max_size') . '</td></tr>';
echo '<tr><td>max_execution_time</td><td>' . ini_get('max_execution_time') . ' seconds</td></tr>';
echo '</table>';
echo '</div>';

// Check log files
echo '<div class="section">';
echo '<h2>📋 Recent Logs</h2>';
if (is_dir($logsDir)) {
    $logFiles = glob($logsDir . '/callback_*.log');
    if (count($logFiles) > 0) {
        echo '<p>Found ' . count($logFiles) . ' log files:</p>';
        foreach (array_reverse($logFiles) as $logFile) {
            echo '<h4>' . basename($logFile) . '</h4>';
            $lines = file($logFile);
            $recent = array_slice($lines, -20); // Show last 20 lines
            echo '<pre style="background: #f5f5f5; padding: 10px; border-radius: 3px; max-height: 300px; overflow-y: auto; font-size: 12px;">' . htmlspecialchars(implode('', $recent)) . '</pre>';
        }
    } else {
        echo '<div class="info">ℹ No log files yet. Submit a callback to create logs.</div>';
    }
}
echo '</div>';

// Action buttons
echo '<div class="section">';
echo '<h2>🧪 Test & Actions</h2>';
echo '<a href="test_callback.html" class="btn">Test Callback Form</a>';
echo '<a href="manage_callbacks.html" class="btn">View Dashboard</a>';
echo '<a href="' . $_SERVER['REQUEST_URI'] . '" class="btn">Refresh</a>';
echo '</div>';

// Test callback submission
echo '<div class="section">';
echo '<h2>🚀 Quick Test</h2>';
echo '<form method="POST" action="process_callback.php" style="background: #f9f9f9; padding: 15px; border-radius: 3px;">';
echo '<input type="text" name="fullName" placeholder="Full Name" required style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 3px;">';
echo '<input type="tel" name="mobileNumber" placeholder="Mobile Number" required style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 3px;">';
echo '<input type="email" name="email" placeholder="Email" required style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 3px;">';
echo '<input type="text" name="businessName" placeholder="Business Name" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 3px;">';
echo '<button type="submit" style="background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer; margin-top: 10px;">Submit Test Callback</button>';
echo '</form>';
echo '</div>';
?>
