-- User Dimension
CREATE TABLE star.dim_users (
    user_id INT PRIMARY KEY,
    user_name VARCHAR(255)
);

-- Date Dimension
CREATE TABLE star.dim_date (
    date_id INT PRIMARY KEY,
    full_date DATE UNIQUE,
    year INT,
    month INT,
    month_name VARCHAR(20),
    week INT,
    day_of_week INT
);

-- Project Dimension
CREATE TABLE star.dim_projects (
    project_id INT PRIMARY KEY,
    project_name VARCHAR(255),
    description TEXT,
    start_date DATE,
    end_date DATE,
    area VARCHAR(255),
    status VARCHAR(50),
    business_owner_id INT, -- Add this column
    tech_owner_id INT, -- Add this column
    FOREIGN KEY (business_owner_id) REFERENCES star.dim_users(user_id),
    FOREIGN KEY (tech_owner_id) REFERENCES star.dim_users(user_id)
);

-- Fact Table
CREATE TABLE star.fact_time_entries (
    time_entry_id INT PRIMARY KEY,
    project_id INT,
    user_id INT,
    date_id INT,
    duration_minutes INT,
    FOREIGN KEY (project_id) REFERENCES star.dim_projects(project_id),
    FOREIGN KEY (user_id) REFERENCES star.dim_users(user_id),
    FOREIGN KEY (date_id) REFERENCES star.dim_date(date_id)
);




select * from star.dim_date

INSERT INTO star.dim_date (date_id, full_date, year, month, month_name, week, day_of_week)
SELECT 
    d AS full_date,
    EXTRACT(YEAR FROM d) AS year,
    EXTRACT(MONTH FROM d) AS month,
    TO_CHAR(d, 'Month') AS month_name,
    EXTRACT(WEEK FROM d) AS week,
    EXTRACT(ISODOW FROM d) AS day_of_week  -- Use ISODOW to ensure Monday=1, Sunday=7
FROM generate_series('2023-01-01'::DATE, '2030-12-31'::DATE, '1 day') AS d;




---------
-- Populate Users Dimension
INSERT INTO star.dim_users (user_id, user_name)
SELECT id, username FROM public.auth_user
ON CONFLICT (user_id) DO UPDATE SET user_name = EXCLUDED.user_name;


-- Populate Projects Dimension
INSERT INTO star.dim_projects (project_id, project_name, description, start_date, end_date, "area", status, business_owner_id, tech_owner_id)
SELECT id, project_name, description, start_date, end_date, "area", status, business_lead_id, tech_lead_id
FROM public.api_project
ON CONFLICT (project_id) DO UPDATE 
SET project_name = EXCLUDED.project_name,
    description = EXCLUDED.description,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    area = EXCLUDED.area,
    status = EXCLUDED.status,
    business_owner_id = EXCLUDED.business_owner_id,
    tech_owner_id = EXCLUDED.tech_owner_id;

-- Populate Fact Table

INSERT INTO star.fact_time_entries (time_entry_id, project_id, user_id, date_id, duration_minutes)
SELECT 
    te.id,
    te.project_id,
    te.user_id,
    EXTRACT(YEAR FROM te.entry_date)*10000 + EXTRACT(MONTH FROM te.entry_date)*100 + EXTRACT(DAY FROM te.entry_date) AS date_id,
    te.duration
FROM public.api_timeentry te
ON CONFLICT (time_entry_id) DO UPDATE 
SET project_id = EXCLUDED.project_id,
    user_id = EXCLUDED.user_id,
    date_id = EXCLUDED.date_id,
    duration_minutes = EXCLUDED.duration_minutes;

CREATE UNIQUE INDEX idx_dim_date_id ON star.dim_date(date_id);
CREATE INDEX idx_dim_date_full_date ON star.dim_date(full_date);
CREATE UNIQUE INDEX idx_dim_users_id ON star.dim_users(user_id);
CREATE INDEX idx_dim_users_name ON star.dim_users(user_name);
CREATE UNIQUE INDEX idx_dim_projects_id ON star.dim_projects(project_id);
CREATE UNIQUE INDEX idx_fact_time_entries_id ON star.fact_time_entries(time_entry_id);
CREATE INDEX idx_fact_time_entries_date_id ON star.fact_time_entries(date_id);
CREATE INDEX idx_fact_time_entries_project_id ON star.fact_time_entries(project_id);
CREATE INDEX idx_fact_time_entries_user_id ON star.fact_time_entries(user_id);
CREATE INDEX idx_fact_time_entries_composite ON star.fact_time_entries(user_id, date_id, project_id);


GRANT USAGE ON SCHEMA star TO timetrackingapp;

-- Grant SELECT on all existing tables in the schema
GRANT SELECT ON ALL TABLES IN SCHEMA star TO timetrackingapp;

-- Ensure future tables also have read access automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA star 
GRANT SELECT ON TABLES TO timetrackingapp;


select * from api_timeentry at2 
where at2.user_id = 4


select * from public.auth_user au 







select * from public.api_timeentry at2 

set entry_date = 2025


