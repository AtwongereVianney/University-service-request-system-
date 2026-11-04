<?php

require_once __DIR__ . '/bootstrap.php';

runApi('GET', function () {
    $database = Database::connect();
    $contact = (new ContactRepository($database))->findOfficeDetails();

    if (!$contact) {
        Http::sendJson(array('error' => 'Office contact details are not available.'), 404);
    }

    Http::sendJson(array('data' => $contact), 200);
});
