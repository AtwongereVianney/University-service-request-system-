<?php

function findOfficeContactDetails($database)
{
    $sql = 'SELECT office_name AS officeName,
                   address_line_1 AS addressLine1,
                   address_line_2 AS addressLine2,
                   city_country AS cityCountry,
                   student_services_email AS studentServicesEmail,
                   ict_support_email AS ictSupportEmail,
                   front_desk_phone AS frontDeskPhone,
                   ict_helpdesk_phone AS ictHelpdeskPhone,
                   weekday_hours AS weekdayHours,
                   saturday_hours AS saturdayHours,
                   holiday_hours AS holidayHours
            FROM contact_info
            WHERE id = 1';
    $result = mysqli_query($database, $sql);
    $contact = mysqli_fetch_assoc($result);
    mysqli_free_result($result);

    return $contact;
}
