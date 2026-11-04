<?php

class RequestRepository
{
    private $database;

    public function __construct($database)
    {
        $this->database = $database;
    }

    public function create($values, $service)
    {
        $reference = 'USRS-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(4)));
        $query = $this->database->prepare(
            'INSERT INTO service_requests
              (reference, full_name, reg_number, phone, email, service_slug, subject, description)
             VALUES
              (:reference, :full_name, :reg_number, :phone, :email, :service_slug, :subject, :description)'
        );
        $query->execute(array(
            'reference' => $reference,
            'full_name' => $values['fullName'],
            'reg_number' => $values['regNumber'],
            'phone' => $values['phone'] !== '' ? $values['phone'] : null,
            'email' => $values['email'],
            'service_slug' => $service['slug'],
            'subject' => $values['subject'],
            'description' => $values['description'],
        ));

        return array(
            'reference' => $reference,
            'submittedAt' => date(DATE_ATOM),
            'fullName' => $values['fullName'],
            'regNumber' => $values['regNumber'],
            'email' => $values['email'],
            'serviceName' => $service['name'],
            'office' => $service['office'],
            'subject' => $values['subject'],
        );
    }
}
