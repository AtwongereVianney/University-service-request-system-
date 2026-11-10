<?php

require_once __DIR__ . '/bootstrap.php';

function escapeRequestHtml($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function sendRequestPage($title, $message, $statusCode, $details = '')
{
    http_response_code($statusCode);
    header('Content-Type: text/html; charset=utf-8');

    $safeTitle = escapeRequestHtml($title);
    $safeMessage = escapeRequestHtml($message);

    echo <<<HTML
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$safeTitle} | USRS</title>
    <link rel="stylesheet" href="../src/css/style.css">
  </head>
  <body>
    <main class="shell section">
      <section class="form-feedback" role="status">
        <h1>{$safeTitle}</h1>
        <p>{$safeMessage}</p>
        {$details}
        <p><a class="btn btn-primary" href="../pages/request.html">Return to the request form</a></p>
      </section>
    </main>
  </body>
</html>
HTML;
    exit;
}

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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    sendRequestPage('Method not allowed', 'Submit requests using the request form.', 405);
}

try {
    $values = validateRequestValues($_POST);
    $database = connectToDatabase();
    $service = findServiceBySlug($database, $values['serviceCategory']);

    if (!$service) {
        throw new InvalidArgumentException('Choose an available service category.');
    }

    $request = createServiceRequest($database, $values, $service);
    $reference = escapeRequestHtml($request['reference']);
    $fullName = escapeRequestHtml($request['fullName']);
    $regNumber = escapeRequestHtml($request['regNumber']);
    $email = escapeRequestHtml($request['email']);
    $serviceName = escapeRequestHtml($request['serviceName']);
    $office = escapeRequestHtml($request['office']);
    $subject = escapeRequestHtml($request['subject']);
    $submittedAt = escapeRequestHtml($request['submittedAt']);

    $details = <<<HTML
<dl>
  <dt>Reference</dt><dd><strong>{$reference}</strong></dd>
  <dt>Student</dt><dd>{$fullName} ({$regNumber})</dd>
  <dt>Email</dt><dd>{$email}</dd>
  <dt>Service</dt><dd>{$serviceName}</dd>
  <dt>Handled by</dt><dd>{$office}</dd>
  <dt>Subject</dt><dd>{$subject}</dd>
  <dt>Submitted</dt><dd>{$submittedAt}</dd>
</dl>
<p>Keep this reference for follow-up with the service desk.</p>
HTML;

    sendRequestPage(
        'Your request has been saved',
        'Your request has been submitted successfully.',
        201,
        $details
    );
} catch (InvalidArgumentException $error) {
    sendRequestPage('Unable to submit request', $error->getMessage(), 422);
} catch (mysqli_sql_exception $error) {
    error_log('USRS database error: ' . $error->getMessage());
    sendRequestPage('Service temporarily unavailable', 'Your request could not be saved right now. Please try again later.', 503);
} catch (Throwable $error) {
    error_log('USRS request error: ' . $error->getMessage());
    sendRequestPage('Request could not be completed', 'Your request could not be completed. Please try again later.', 500);
}
