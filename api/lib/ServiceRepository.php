<?php

class ServiceRepository
{
    private $database;

    public function __construct($database)
    {
        $this->database = $database;
    }

    public function findActiveServices()
    {
        $query = $this->database->query(
            'SELECT slug, name, description, office, is_featured AS featured
             FROM services
             WHERE is_active = 1
             ORDER BY name'
        );

        return $query->fetchAll();
    }

    public function findBySlug($slug)
    {
        $query = $this->database->prepare(
            'SELECT slug, name, office
             FROM services
             WHERE slug = :slug AND is_active = 1'
        );
        $query->execute(array('slug' => $slug));

        return $query->fetch();
    }
}
