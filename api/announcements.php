<?php

require_once __DIR__ . '/bootstrap.php';

runApi('GET', function () {
    $database = Database::connect();
    $announcements = (new AnnouncementRepository($database))->findPublished();
    Http::sendJson(array('data' => $announcements), 200);
});
