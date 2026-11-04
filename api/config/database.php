<?php

function databaseConfig()
{
    $envPath = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.env';
    $localValues = is_file($envPath) ? parse_ini_file($envPath, false, INI_SCANNER_RAW) : array();

    if ($localValues === false) {
        throw new RuntimeException('Unable to read the local .env configuration file.');
    }

    $config = array(
        'host' => '127.0.0.1',
        'port' => '3306',
        'name' => 'university_service_request_system',
        'user' => '',
        'password' => '',
    );

    foreach (array_keys($config) as $key) {
        $settingName = 'USRS_DB_' . strtoupper($key);
        $environmentValue = getenv($settingName);

        if ($environmentValue !== false) {
            $config[$key] = $environmentValue;
        } elseif (isset($localValues[$settingName])) {
            $config[$key] = $localValues[$settingName];
        }
    }

    return $config;
}
