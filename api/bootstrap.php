<?php

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/lib/Database.php';
require_once __DIR__ . '/lib/Http.php';
require_once __DIR__ . '/lib/ServiceRepository.php';
require_once __DIR__ . '/lib/RequestRepository.php';
require_once __DIR__ . '/lib/AnnouncementRepository.php';
require_once __DIR__ . '/lib/ContactRepository.php';

function runApi($expectedMethod, $handler)
{
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Allow: GET, POST, OPTIONS');
        http_response_code(204);
        exit;
    }

    try {
        Http::requireMethod($expectedMethod);
        $handler();
    } catch (InvalidArgumentException $error) {
        Http::sendJson(array('error' => $error->getMessage()), 422);
    } catch (PDOException $error) {
        error_log('USRS database error: ' . $error->getMessage());
        Http::sendJson(array('error' => 'The service is temporarily unavailable. Please try again later.'), 503);
    } catch (Throwable $error) {
        error_log('USRS API error: ' . $error->getMessage());
        Http::sendJson(array('error' => 'The request could not be completed.'), 500);
    }
}
