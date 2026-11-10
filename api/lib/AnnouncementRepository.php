<?php

function findPublishedAnnouncements($database)
{
    $sql = 'SELECT announcements.id, announcements.title, announcements.body,
                   announcements.published_at AS publishedAt,
                   services.name AS category, services.office
            FROM announcements
            LEFT JOIN services ON services.slug = announcements.service_slug
            WHERE announcements.is_published = 1
            ORDER BY announcements.published_at DESC, announcements.id DESC
            LIMIT 20';
    $result = mysqli_query($database, $sql);
    $announcements = mysqli_fetch_all($result, MYSQLI_ASSOC);
    mysqli_free_result($result);

    return $announcements;
}
