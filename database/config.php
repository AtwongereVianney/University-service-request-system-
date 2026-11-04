<?php

require_once __DIR__ . '/../api/config/database.php';

function databaseAdminConfig()
{
    $envPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env.admin';
    $localValues = is_file($envPath) ? parse_ini_file($envPath, false, INI_SCANNER_RAW) : array();

    if ($localValues === false) {
        throw new RuntimeException('Unable to read the local .env.admin configuration file.');
    }

    $appConfig = databaseConfig();

    return array(
        'host' => isset($localValues['USRS_DB_ADMIN_HOST']) ? $localValues['USRS_DB_ADMIN_HOST'] : $appConfig['host'],
        'port' => isset($localValues['USRS_DB_ADMIN_PORT']) ? $localValues['USRS_DB_ADMIN_PORT'] : $appConfig['port'],
        'user' => isset($localValues['USRS_DB_ADMIN_USER']) ? $localValues['USRS_DB_ADMIN_USER'] : '',
        'password' => isset($localValues['USRS_DB_ADMIN_PASSWORD']) ? $localValues['USRS_DB_ADMIN_PASSWORD'] : '',
    );
}

function quoteDatabaseIdentifier($identifier)
{
    if (!preg_match('/^[A-Za-z0-9_]{1,64}$/', $identifier)) {
        throw new InvalidArgumentException('Database and account names may only contain letters, numbers and underscores.');
    }

    return '`' . $identifier . '`';
}
