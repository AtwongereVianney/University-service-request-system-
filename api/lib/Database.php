<?php

function connectToDatabase()
{
    $config = databaseConfig();
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    $database = mysqli_connect(
        $config['host'],
        $config['user'],
        $config['password'],
        $config['name']
    );

    if (!$database) {
        throw new RuntimeException('Database connection failed: ' . mysqli_connect_error());
    }

    mysqli_set_charset($database, 'utf8mb4');

    return $database;
}
