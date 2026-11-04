CREATE DATABASE IF NOT EXISTS university_service_request_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE university_service_request_system;

CREATE TABLE IF NOT EXISTS services (
  slug VARCHAR(50) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(500) NOT NULL,
  office VARCHAR(120) NOT NULL,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS service_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  reference VARCHAR(32) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  reg_number VARCHAR(50) NOT NULL,
  phone VARCHAR(40) NULL,
  email VARCHAR(254) NOT NULL,
  service_slug VARCHAR(50) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  status ENUM('submitted', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_service_requests_service
    FOREIGN KEY (service_slug) REFERENCES services (slug),
  INDEX idx_service_requests_status_date (status, submitted_at),
  INDEX idx_service_requests_reg_number (reg_number)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS announcements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  service_slug VARCHAR(50) NULL,
  published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_announcements_service
    FOREIGN KEY (service_slug) REFERENCES services (slug),
  UNIQUE KEY uq_announcements_title_service (title, service_slug),
  INDEX idx_announcements_published (is_published, published_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_info (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  office_name VARCHAR(120) NOT NULL,
  address_line_1 VARCHAR(180) NOT NULL,
  address_line_2 VARCHAR(180) NOT NULL,
  city_country VARCHAR(120) NOT NULL,
  student_services_email VARCHAR(254) NOT NULL,
  ict_support_email VARCHAR(254) NOT NULL,
  front_desk_phone VARCHAR(40) NOT NULL,
  ict_helpdesk_phone VARCHAR(40) NOT NULL,
  weekday_hours VARCHAR(120) NOT NULL,
  saturday_hours VARCHAR(120) NOT NULL,
  holiday_hours VARCHAR(120) NOT NULL
) ENGINE=InnoDB;

INSERT INTO services (slug, name, description, office, is_featured) VALUES
  ('transcript', 'Academic transcript request', 'Official or provisional transcripts for further studies, employers or scholarships.', 'Academic Registrar', 1),
  ('clearance', 'Clearance request', 'Departmental, library, finance and hostel clearance for graduation or withdrawal.', 'Dean of Students', 1),
  ('letter', 'Letter request', 'Introduction, recommendation, internship and bank letters signed by the faculty.', 'Faculty Administrator', 0),
  ('hostel', 'Hostel service request', 'Room allocation, transfers, repairs and hall of residence complaints.', 'Hostel Warden', 0),
  ('it-support', 'IT support request', 'Student portal access, university email, campus Wi-Fi and lab accounts.', 'ICT Directorate', 1),
  ('examination', 'Examination issue', 'Missing marks, results queries, special examinations and remarking applications.', 'Examinations Office', 0),
  ('registration', 'Registration support', 'Course registration, programme and course unit changes.', 'Academic Registrar', 0),
  ('finance', 'Finance inquiry', 'Tuition statements, missing payments, refunds and functional fees questions.', 'Bursar''s Office', 0),
  ('general', 'General student service', 'Anything that does not fit the categories above; the front desk routes it for you.', 'Office of Student Services', 0)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  office = VALUES(office),
  is_featured = VALUES(is_featured);

INSERT INTO announcements (title, body, service_slug, published_at) VALUES
  ('Transcript requests: allow time for processing', 'Submit transcript requests early and include the purpose and any delivery deadline in your request details.', 'transcript', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)),
  ('Graduation clearance checklist', 'Students preparing for graduation should check faculty, library, finance and hostel clearance requirements.', 'clearance', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)),
  ('Student portal support', 'Include your registration number and a short description of the issue when requesting portal or email support.', 'it-support', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)),
  ('Examination results queries', 'For a results query, include the course unit and examination period so the office can review the correct record.', 'examination', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)),
  ('Course registration changes', 'Contact the Academic Registrar with course unit details if you need help with your registration.', 'registration', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)),
  ('Finance statement inquiries', 'Include the relevant semester and transaction reference when asking about a student account statement.', 'finance', DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY))
ON DUPLICATE KEY UPDATE
  body = VALUES(body),
  published_at = VALUES(published_at);

INSERT INTO contact_info
  (id, office_name, address_line_1, address_line_2, city_country,
   student_services_email, ict_support_email, front_desk_phone, ict_helpdesk_phone,
   weekday_hours, saturday_hours, holiday_hours)
VALUES
  (1, 'Office of Student Services', 'Administration Block, Ground Floor', 'Room A12, Main Campus',
   'Fort Portal, Uganda', 'studentservices@university.ac.ug', 'ictsupport@university.ac.ug',
   '+256 700 000 000', '+256 700 000 001', 'Monday to Friday, 8:00 am - 5:00 pm',
   'Saturday, 9:00 am - 1:00 pm', 'Closed on public holidays')
ON DUPLICATE KEY UPDATE
  office_name = VALUES(office_name),
  address_line_1 = VALUES(address_line_1),
  address_line_2 = VALUES(address_line_2),
  city_country = VALUES(city_country),
  student_services_email = VALUES(student_services_email),
  ict_support_email = VALUES(ict_support_email),
  front_desk_phone = VALUES(front_desk_phone),
  ict_helpdesk_phone = VALUES(ict_helpdesk_phone),
  weekday_hours = VALUES(weekday_hours),
  saturday_hours = VALUES(saturday_hours),
  holiday_hours = VALUES(holiday_hours);
