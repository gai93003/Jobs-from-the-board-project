
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('Trainee', 'Mentor', 'Staff', 'Admin');
    END IF;
END $$;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('Pending', 'Approved');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
user_id SERIAL PRIMARY KEY,
full_name VARCHAR(100) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
user_role user_role NOT NULL DEFAULT 'Trainee',
description TEXT,
account_status user_status NOT NULL DEFAULT 'Pending',
mentor_id INT REFERENCES users(user_id),
created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'employment_type_enum') THEN
        CREATE TYPE employment_type_enum AS ENUM ('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS jobs (
    job_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    employment_type employment_type_enum NOT NULL,
    exp_level VARCHAR(500),
    partner_name VARCHAR(500),
    tech_stack VARCHAR(255),
    source VARCHAR(255),
    external_job_id VARCHAR(255),
    apply_url VARCHAR(255) NOT NULL,
    active_from TIMESTAMPTZ,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);



-- application_status enum + applications table
DO $$ BEGIN
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'Interested';
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'Application Started';
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'Application Submitted';
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'Invited to Interview';
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'Application Declined';
END $$;

CREATE TABLE IF NOT EXISTS applications (
    application_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    job_id INT NOT NULL REFERENCES jobs (job_id) ON DELETE CASCADE,
    status application_status_enum NOT NULL DEFAULT 'Application Started',
    created_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, job_id)
);