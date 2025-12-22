-- Insert a test user (migration/seed)
-- Email: test@example.com
-- Password: password123
INSERT INTO users (full_name, email, password_hash, role)
VALUES ('Test User', 'test@example.com', '$2b$10$/VeK2NEiDFLyh9rBMXbcQeRedxbpEli9x8Z9bGV91YMxwN41RtO7S', 'employee')
ON CONFLICT (email) DO NOTHING;

-- Insert manager user
-- Email: manager@example.com
-- Password: password123
INSERT INTO users (full_name, email, password_hash, role)
VALUES ('Manager User', 'manager@example.com', '$2b$10$/VeK2NEiDFLyh9rBMXbcQeRedxbpEli9x8Z9bGV91YMxwN41RtO7S', 'employee')
ON CONFLICT (email) DO NOTHING;

-- Insert admin user
-- Email: admin@example.com
-- Password: password123
INSERT INTO users (full_name, email, password_hash, role)
VALUES ('Admin User', 'admin@example.com', '$2b$10$/VeK2NEiDFLyh9rBMXbcQeRedxbpEli9x8Z9bGV91YMxwN41RtO7S', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed/migration inserts for leave_requests (tables are created in ../create_tables.sql)

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT 
    u.id,
    'vacation',
    '2025-12-20',
    '2025-12-27',
    'approved',
    'Christmas vacation'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT 
    u.id,
    'sick',
    '2025-11-15',
    '2025-11-16',
    'approved',
    'Flu symptoms'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT 
    u.id,
    'personal',
    '2025-12-01',
    '2025-12-01',
    'pending',
    'Personal appointment'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT 
    u.id,
    'vacation',
    '2025-10-10',
    '2025-10-12',
    'declined',
    'Fall break'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

-- Insert 5 new employee users
INSERT INTO users (full_name, email, password_hash, role)
VALUES 
  ('John Smith', 'john.smith@example.com', '$2b$10$/VeK2NEiDFLyh9rBMXbcQeRedxbpEli9x8Z9bGV91YMxwN41RtO7S', 'employee'),
  ('Sarah Johnson', 'sarah.johnson@example.com', '$2b$10$/VeK2NEiDFLyh9rBMXbcQeRedxbpEli9x8Z9bGV91YMxwN41RtO7S', 'employee'),
  ('Michael Brown', 'michael.brown@example.com', '$2b$10$/VeK2NEiDFLyh9rBMXbcQeRedxbpEli9x8Z9bGV91YMxwN41RtO7S', 'employee'),
  ('Emily Davis', 'emily.davis@example.com', '$2b$10$/VeK2NEiDFLyh9rBMXbcQeRedxbpEli9x8Z9bGV91YMxwN41RtO7S', 'employee'),
  ('David Wilson', 'david.wilson@example.com', '$2b$10$/VeK2NEiDFLyh9rBMXbcQeRedxbpEli9x8Z9bGV91YMxwN41RtO7S', 'employee')
ON CONFLICT (email) DO NOTHING;

-- John Smith's leave requests
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2025-12-23', '2025-12-30', 'pending', 'Holiday vacation'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2025-11-10', '2025-11-11', 'approved', 'Medical appointment'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'personal', '2025-10-15', '2025-10-15', 'declined', 'Personal matter'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-01-05', '2026-01-10', 'pending', 'New year break'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2025-09-20', '2025-09-22', 'approved', 'Conference attendance'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

-- Sarah Johnson's leave requests
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2025-12-15', '2025-12-22', 'approved', 'Winter holidays'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2025-11-05', '2025-11-06', 'approved', 'Cold and fever'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'personal', '2025-11-25', '2025-11-25', 'pending', 'Family event'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-02-10', '2026-02-14', 'pending', 'Ski trip'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2025-10-01', '2025-10-01', 'declined', 'Moving day'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;

-- Michael Brown's leave requests
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2025-11-28', '2025-12-01', 'approved', 'Thanksgiving break'
FROM users u WHERE u.email = 'michael.brown@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2025-10-20', '2025-10-21', 'approved', 'Stomach flu'
FROM users u WHERE u.email = 'michael.brown@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'personal', '2025-12-05', '2025-12-05', 'pending', 'Car service appointment'
FROM users u WHERE u.email = 'michael.brown@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-03-15', '2026-03-20', 'pending', 'Spring break'
FROM users u WHERE u.email = 'michael.brown@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2025-09-10', '2025-09-11', 'declined', 'Personal project'
FROM users u WHERE u.email = 'michael.brown@example.com'
ON CONFLICT DO NOTHING;

-- Emily Davis's leave requests
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2025-12-20', '2025-12-27', 'pending', 'Christmas with family'
FROM users u WHERE u.email = 'emily.davis@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2025-11-12', '2025-11-13', 'approved', 'Dental procedure'
FROM users u WHERE u.email = 'emily.davis@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'personal', '2025-10-25', '2025-10-25', 'approved', 'Wedding attendance'
FROM users u WHERE u.email = 'emily.davis@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-04-05', '2026-04-12', 'pending', 'Easter vacation'
FROM users u WHERE u.email = 'emily.davis@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2025-09-15', '2025-09-16', 'declined', 'Home renovation'
FROM users u WHERE u.email = 'emily.davis@example.com'
ON CONFLICT DO NOTHING;

-- David Wilson's leave requests
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2025-11-18', '2025-11-22', 'approved', 'Long weekend trip'
FROM users u WHERE u.email = 'david.wilson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2025-10-30', '2025-10-31', 'approved', 'Back pain treatment'
FROM users u WHERE u.email = 'david.wilson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'personal', '2025-12-10', '2025-12-10', 'pending', 'School event'
FROM users u WHERE u.email = 'david.wilson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-05-01', '2026-05-05', 'pending', 'May holiday'
FROM users u WHERE u.email = 'david.wilson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2025-09-25', '2025-09-26', 'declined', 'Volunteer work'
FROM users u WHERE u.email = 'david.wilson@example.com'
ON CONFLICT DO NOTHING;

-- Additional leave requests for better pagination testing
-- Test User additional requests
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-06-15', '2026-06-22', 'pending', 'Summer vacation'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2025-08-05', '2025-08-06', 'approved', 'Doctor appointment'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

-- John Smith additional requests
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-07-01', '2026-07-15', 'pending', 'Summer holiday'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'personal', '2025-08-20', '2025-08-20', 'approved', 'Birthday'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2025-07-10', '2025-07-12', 'approved', 'Surgery recovery'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

-- Sarah Johnson additional requests
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-08-10', '2026-08-17', 'pending', 'Beach vacation'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'personal', '2025-09-05', '2025-09-05', 'approved', 'Graduation ceremony'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2025-08-15', '2025-08-16', 'declined', 'Minor illness'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;

-- Michael Brown additional requests
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-09-01', '2026-09-10', 'pending', 'Road trip'
FROM users u WHERE u.email = 'michael.brown@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2025-07-22', '2025-07-23', 'approved', 'Training course'
FROM users u WHERE u.email = 'michael.brown@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'personal', '2025-08-10', '2025-08-11', 'pending', 'House hunting'
FROM users u WHERE u.email = 'michael.brown@example.com'
ON CONFLICT DO NOTHING;

-- Emily Davis additional requests
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-10-15', '2026-10-20', 'pending', 'Fall colors tour'
FROM users u WHERE u.email = 'emily.davis@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2025-07-18', '2025-07-19', 'approved', 'Medical checkup'
FROM users u WHERE u.email = 'emily.davis@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2025-08-25', '2025-08-26', 'declined', 'Community service'
FROM users u WHERE u.email = 'emily.davis@example.com'
ON CONFLICT DO NOTHING;

-- David Wilson additional requests
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-11-10', '2026-11-17', 'pending', 'Cruise vacation'
FROM users u WHERE u.email = 'david.wilson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'personal', '2025-07-05', '2025-07-05', 'approved', 'Anniversary celebration'
FROM users u WHERE u.email = 'david.wilson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2025-08-08', '2025-08-09', 'approved', 'Physical therapy'
FROM users u WHERE u.email = 'david.wilson@example.com'
ON CONFLICT DO NOTHING;

-- Additional mixed requests
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2025-07-20', '2025-07-25', 'approved', 'Mid-year break'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2025-06-15', '2025-06-16', 'pending', 'Workshop attendance'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2025-06-01', '2025-06-05', 'declined', 'Early summer trip'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2026-07-20', '2026-07-25', 'approved', 'Mid-year break'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-06-15', '2026-06-16', 'pending', 'Workshop attendance'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2026-06-01', '2026-06-05', 'declined', 'Early summer trip'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2026-07-20', '2026-07-25', 'approved', 'Mid-year break'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-06-15', '2026-06-16', 'pending', 'Workshop attendance'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2026-06-01', '2026-06-05', 'declined', 'Early summer trip'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2026-07-20', '2026-07-25', 'approved', 'Mid-year break'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-06-15', '2026-06-16', 'pending', 'Workshop attendance'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2026-06-01', '2026-06-05', 'declined', 'Early summer trip'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2026-07-20', '2026-07-25', 'approved', 'Mid-year break'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-06-15', '2026-06-16', 'pending', 'Workshop attendance'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2026-06-01', '2026-06-05', 'declined', 'Early summer trip'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2026-07-20', '2026-07-25', 'approved', 'Mid-year break'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-06-15', '2026-06-16', 'pending', 'Workshop attendance'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2026-06-01', '2026-06-05', 'declined', 'Early summer trip'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2026-07-20', '2026-07-25', 'approved', 'Mid-year break'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-06-15', '2026-06-16', 'pending', 'Workshop attendance'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2026-06-01', '2026-06-05', 'declined', 'Early summer trip'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;
INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'sick', '2026-07-20', '2026-07-25', 'approved', 'Mid-year break'
FROM users u WHERE u.email = 'test@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'vacation', '2026-06-15', '2026-06-16', 'pending', 'Workshop attendance'
FROM users u WHERE u.email = 'john.smith@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leave_requests (user_id, type, start_date, end_date, status, reason)
SELECT u.id, 'other', '2026-06-01', '2026-06-05', 'declined', 'Early summer trip'
FROM users u WHERE u.email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;
-- Insert test teams
INSERT INTO teams (name, description)
VALUES 
  ('Engineering Team', 'Core development team responsible for building new features'),
  ('Design Team', 'UI/UX designers creating beautiful user experiences'),
  ('Marketing Team', 'Marketing and communications team')
ON CONFLICT (name) DO NOTHING;

-- Insert team members for Engineering Team
INSERT INTO team_members (team_id, user_id, is_manager)
SELECT t.id, u.id, true
FROM teams t, users u
WHERE t.name = 'Engineering Team' AND u.email = 'manager@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO team_members (team_id, user_id, is_manager)
SELECT t.id, u.id, false
FROM teams t, users u
WHERE t.name = 'Engineering Team' AND u.email = 'john.smith@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO team_members (team_id, user_id, is_manager)
SELECT t.id, u.id, false
FROM teams t, users u
WHERE t.name = 'Engineering Team' AND u.email = 'michael.brown@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO team_members (team_id, user_id, is_manager)
SELECT t.id, u.id, false
FROM teams t, users u
WHERE t.name = 'Engineering Team' AND u.email = 'test@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;

-- Insert team members for Design Team
INSERT INTO team_members (team_id, user_id, is_manager)
SELECT t.id, u.id, true
FROM teams t, users u
WHERE t.name = 'Design Team' AND u.email = 'sarah.johnson@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO team_members (team_id, user_id, is_manager)
SELECT t.id, u.id, false
FROM teams t, users u
WHERE t.name = 'Design Team' AND u.email = 'emily.davis@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;

-- Insert team members for Marketing Team
INSERT INTO team_members (team_id, user_id, is_manager)
SELECT t.id, u.id, true
FROM teams t, users u
WHERE t.name = 'Marketing Team' AND u.email = 'admin@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;

INSERT INTO team_members (team_id, user_id, is_manager)
SELECT t.id, u.id, false
FROM teams t, users u
WHERE t.name = 'Marketing Team' AND u.email = 'david.wilson@example.com'
ON CONFLICT (team_id, user_id) DO NOTHING;

-- Insert collective days off (company holidays)
INSERT INTO collective_days_off (start_date, end_date, description)
VALUES 
    ('2025-01-01', '2025-01-01', 'New Year Holiday'),
    ('2025-12-25', '2025-12-26', 'Christmas Holiday'),
    ('2025-04-21', '2025-04-21', 'Easter Monday Holiday'),
    ('2026-05-01', '2026-05-01', 'International Workers Day')
ON CONFLICT DO NOTHING;
