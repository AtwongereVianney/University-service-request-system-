<?php

class AnnouncementRepository
{
    private $database;

    public function __construct($database)
    {
        $this->database = $database;
    }

    public function findPublished()
    {
        $query = $this->database->query(
            'SELECT announcements.id, announcements.title, announcements.body,
                    announcements.published_at AS publishedAt,
                    services.name AS category, services.office
             FROM announcements
             LEFT JOIN services ON services.slug = announcements.service_slug
             WHERE announcements.is_published = 1
             ORDER BY announcements.published_at DESC, announcements.id DESC
             LIMIT 20'
        );

        return $query->fetchAll();
    }
}
