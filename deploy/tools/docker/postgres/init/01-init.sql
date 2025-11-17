-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert a test user
-- Email: test@example.com
-- Password: password123
INSERT INTO users (full_name, email, password_hash)
VALUES ('Test User', 'test@example.com', '$2b$10$/VeK2NEiDFLyh9rBMXbcQeRedxbpEli9x8Z9bGV91YMxwN41RtO7S')
ON CONFLICT (email) DO NOTHING;
