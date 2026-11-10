<?php

require_once __DIR__ . '/bootstrap.php';

runApi('GET', function () {
    $database = connectToDatabase();
    $contact = findOfficeContactDetails($database);

    if (!$contact) {
        Http::sendJson(array('error' => 'Office contact details are not available.'), 404);
    }

    Http::sendJson(array('data' => $contact), 200);
});
