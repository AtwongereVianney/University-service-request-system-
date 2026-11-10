<?php

function createServiceRequest($database, $values, $service)
{
    $reference = 'USRS-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(4)));
    $sql = 'INSERT INTO service_requests
              (reference, full_name, reg_number, phone, email, service_slug, subject, description)
            VALUES
              (?, ?, ?, ?, ?, ?, ?, ?)';
    $statement = mysqli_prepare($database, $sql);

    $fullName = $values['fullName'];
    $regNumber = $values['regNumber'];
    $phone = $values['phone'] !== '' ? $values['phone'] : null;
    $email = $values['email'];
    $serviceSlug = $service['slug'];
    $subject = $values['subject'];
    $description = $values['description'];

    mysqli_stmt_bind_param(
        $statement,
        'ssssssss',
        $reference,
        $fullName,
        $regNumber,
        $phone,
        $email,
        $serviceSlug,
        $subject,
        $description
    );
    mysqli_stmt_execute($statement);
    mysqli_stmt_close($statement);

    return array(
        'reference' => $reference,
        'submittedAt' => date(DATE_ATOM),
        'fullName' => $fullName,
        'regNumber' => $regNumber,
        'email' => $email,
        'serviceName' => $service['name'],
        'office' => $service['office'],
        'subject' => $subject,
    );
}
