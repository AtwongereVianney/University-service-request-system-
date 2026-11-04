<?php

require_once __DIR__ . '/bootstrap.php';

runApi('GET', function () {
    $database = Database::connect();
    $services = (new ServiceRepository($database))->findActiveServices();

    foreach ($services as &$service) {
        $service['featured'] = (bool) $service['featured'];
    }
    unset($service);

    Http::sendJson(array('data' => $services), 200);
});
