<?php

require_once __DIR__ . '/bootstrap.php';

function validateRequestValues($payload)
{
    $limits = array(
        'fullName' => 150,
        'regNumber' => 50,
        'phone' => 40,
        'email' => 254,
        'serviceCategory' => 50,
        'subject' => 200,
        'description' => 1000,
    );
    $values = array();

    foreach ($limits as $field => $limit) {
        $value = isset($payload[$field]) && is_string($payload[$field])
            ? trim($payload[$field])
            : '';

        $length = preg_match_all('/./us', $value);

        if ($length === false) {
            throw new InvalidArgumentException(ucfirst($field) . ' must contain valid UTF-8 text.');
        }

        if ($length > $limit) {
            throw new InvalidArgumentException(ucfirst($field) . ' is too long.');
        }

        $values[$field] = $value;
    }

    foreach (array('fullName', 'regNumber', 'email', 'serviceCategory', 'subject', 'description') as $field) {
        if ($values[$field] === '') {
            throw new InvalidArgumentException('Please complete all required fields.');
        }
    }

    if (!filter_var($values['email'], FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Enter a valid email address.');
    }

    return $values;
}

runApi('POST', function () {
    $values = validateRequestValues(Http::readJson());
    $database = connectToDatabase();
    $service = findServiceBySlug($database, $values['serviceCategory']);

    if (!$service) {
        throw new InvalidArgumentException('Choose an available service category.');
    }

    $request = createServiceRequest($database, $values, $service);
    Http::sendJson(array('data' => $request), 201);
});
