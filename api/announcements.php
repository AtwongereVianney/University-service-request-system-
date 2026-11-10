<?php

require_once __DIR__ . '/bootstrap.php';

runApi('GET', function () {
    $database = connectToDatabase();
    $announcements = findPublishedAnnouncements($database);
    Http::sendJson(array('data' => $announcements), 200);
});
