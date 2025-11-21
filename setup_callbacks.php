<?php
/**
 * Setup file to initialize callbacks.json with proper permissions
 * Visit this file in browser: http://localhost/abhyuday/setup_callbacks.php
 */

$callbacksFile = __DIR__ . '/callbacks.json';

// Create empty callbacks.json if it doesn't exist
if (!file_exists($callbacksFile)) {
    $result = file_put_contents($callbacksFile, json_encode([], JSON_PRETTY_PRINT));
    
    if ($result !== false) {
        // Try to make it writable
        chmod($callbacksFile, 0666);
        echo "<h2 style='color: green;'>✓ callbacks.json created successfully!</h2>";
        echo "<p>File path: " . $callbacksFile . "</p>";
        echo "<p>File exists: " . (file_exists($callbacksFile) ? 'YES' : 'NO') . "</p>";
        echo "<p>File writable: " . (is_writable($callbacksFile) ? 'YES' : 'NO') . "</p>";
    } else {
        echo "<h2 style='color: red;'>✗ Error creating callbacks.json</h2>";
        echo "<p>Make sure the directory is writable: " . __DIR__ . "</p>";
    }
} else {
    echo "<h2 style='color: blue;'>ℹ callbacks.json already exists</h2>";
    echo "<p>File path: " . $callbacksFile . "</p>";
    echo "<p>File writable: " . (is_writable($callbacksFile) ? 'YES' : 'NO') . "</p>";
    echo "<p>File size: " . filesize($callbacksFile) . " bytes</p>";
    
    // Show current contents
    $content = file_get_contents($callbacksFile);
    $data = json_decode($content, true);
    echo "<h3>Current Callbacks: " . count($data) . "</h3>";
    echo "<pre>" . json_encode($data, JSON_PRETTY_PRINT) . "</pre>";
}

echo "<hr>";
echo "<h3>Test Form Submission</h3>";
echo "<a href='test_callback.html' target='_blank' class='btn'>Click here to test callback form</a>";
?>
