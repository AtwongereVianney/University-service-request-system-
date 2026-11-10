<?php

function findActiveServices($database)
{
    $sql = 'SELECT slug, name, description, office, is_featured AS featured
            FROM services
            WHERE is_active = 1
            ORDER BY name';
    $result = mysqli_query($database, $sql);
    $services = mysqli_fetch_all($result, MYSQLI_ASSOC);
    mysqli_free_result($result);

    return $services;
}

function findServiceBySlug($database, $slug)
{
    $sql = 'SELECT slug, name, office
            FROM services
            WHERE slug = ? AND is_active = 1';
    $statement = mysqli_prepare($database, $sql);
    mysqli_stmt_bind_param($statement, 's', $slug);
    mysqli_stmt_execute($statement);

    $result = mysqli_stmt_get_result($statement);
    $service = mysqli_fetch_assoc($result);
    mysqli_free_result($result);
    mysqli_stmt_close($statement);

    return $service;
}
