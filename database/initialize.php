<?php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../api/config/database.php';

$config = databaseConfig();
$schema = file_get_contents(__DIR__ . '/schema.sql');

if ($schema === false) {
    fwrite(STDERR, "Unable to read database/schema.sql\n");
    exit(1);
}

$databaseName = quoteDatabaseIdentifier($config['name']);

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $database = mysqli_connect(
        $config['host'],
        $config['user'],
        $config['password']
    );
    if (!$database) {
        throw new RuntimeException('Database connection failed: ' . mysqli_connect_error());
    }
    mysqli_set_charset($database, 'utf8mb4');

    mysqli_query($database, 'CREATE DATABASE IF NOT EXISTS ' . $databaseName . ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    mysqli_select_db($database, $config['name']);

    foreach (preg_split('/;\s*(?:\r?\n|$)/', $schema) as $statement) {
        $statement = trim($statement);
        if ($statement !== '' && stripos($statement, 'CREATE DATABASE ') !== 0 && stripos($statement, 'USE ') !== 0) {
            mysqli_query($database, $statement);
        }
    }

    mysqli_close($database);
} catch (Throwable $error) {
    fwrite(STDERR, "Database initialization failed: " . $error->getMessage() . "\n");
    fwrite(STDERR, "Check the database settings in api/config/database.php and confirm MySQL is running.\n");
    exit(1);
}

echo "Database " . $config['name'] . " initialized and seeded.\n";
