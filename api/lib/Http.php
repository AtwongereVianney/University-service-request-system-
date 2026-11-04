<?php

class Http
{
    public static function sendJson($payload, $statusCode)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function readJson()
    {
        $rawBody = file_get_contents('php://input');
        $payload = json_decode($rawBody, true);

        if (!is_array($payload)) {
            throw new InvalidArgumentException('Request body must be valid JSON.');
        }

        return $payload;
    }

    public static function requireMethod($expectedMethod)
    {
        if ($_SERVER['REQUEST_METHOD'] !== $expectedMethod) {
            header('Allow: ' . $expectedMethod . ', OPTIONS');
            self::sendJson(array('error' => 'Method not allowed.'), 405);
        }
    }
}
