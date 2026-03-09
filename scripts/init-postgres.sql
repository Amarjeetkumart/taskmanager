-- PostgreSQL Initialization Script
-- This ensures the database is created with the correct name

-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE taskmanager'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'taskmanager')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE taskmanager TO taskuser;
