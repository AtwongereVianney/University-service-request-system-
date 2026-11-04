<?php

require_once __DIR__ . '/config.php';

$config = databaseConfig();
$adminConfig = databaseAdminConfig();
$schema = file_get_contents(__DIR__ . '/schema.sql');

if ($schema === false) {
    fwrite(STDERR, "Unable to read database/schema.sql\n");
    exit(1);
}

$databaseName = quoteDatabaseIdentifier($config['name']);

try {
    if ($adminConfig['user'] === '') {
        throw new RuntimeException('Set USRS_DB_ADMIN_USER in the local .env.admin file.');
    }
    if (strtolower($config['user']) === 'root' || $config['user'] === '' || $config['password'] === '') {
        throw new RuntimeException('Set USRS_DB_USER and a non-empty USRS_DB_PASSWORD for a dedicated application account in .env.');
    }

    $dsn = 'mysql:host=' . $adminConfig['host'] . ';port=' . $adminConfig['port'] . ';charset=utf8mb4';
    $database = new PDO($dsn, $adminConfig['user'], $adminConfig['password'], array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ));

    $database->exec('CREATE DATABASE IF NOT EXISTS ' . $databaseName . ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    $database->exec('USE ' . $databaseName);

    foreach (preg_split('/;\s*(?:\r?\n|$)/', $schema) as $statement) {
        $statement = trim($statement);
        if ($statement !== '' && stripos($statement, 'CREATE DATABASE ') !== 0 && stripos($statement, 'USE ') !== 0) {
            $database->exec($statement);
        }
    }

    $quotedAppUser = $database->quote($config['user']);
    $quotedAppHost = $database->quote('127.0.0.1');
    $quotedPassword = $database->quote($config['password']);
    $database->exec(
        'CREATE USER IF NOT EXISTS ' . $quotedAppUser . '@' . $quotedAppHost . ' IDENTIFIED BY ' . $quotedPassword
    );
    $database->exec(
        'ALTER USER ' . $quotedAppUser . '@' . $quotedAppHost . ' IDENTIFIED BY ' . $quotedPassword
    );
    $database->exec(
        'GRANT SELECT ON ' . $databaseName . '.services TO ' . $quotedAppUser . '@' . $quotedAppHost
    );
    $database->exec(
        'GRANT SELECT ON ' . $databaseName . '.announcements TO ' . $quotedAppUser . '@' . $quotedAppHost
    );
    $database->exec(
        'GRANT SELECT ON ' . $databaseName . '.contact_info TO ' . $quotedAppUser . '@' . $quotedAppHost
    );
    $database->exec(
        'GRANT INSERT ON ' . $databaseName . '.service_requests TO ' . $quotedAppUser . '@' . $quotedAppHost
    );
} catch (Throwable $error) {
    fwrite(STDERR, "Database initialization failed: " . $error->getMessage() . "\n");
    fwrite(STDERR, "Check the .env and .env.admin files and confirm the MySQL server is running.\n");
    exit(1);
}

echo "Database " . $config['name'] . " initialized, seeded and granted to the application account.\n";
