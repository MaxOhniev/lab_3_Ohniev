-- Set up the "taskboard" schema
CREATE TABLE IF NOT EXISTS tasks (
                                     id SERIAL PRIMARY KEY,
                                     title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO tasks (title)
VALUES
    ('Initial Task A'),
    ('Initial Task B'),
    ('Initial Task C')
    ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_tasks_created_at
    ON tasks (created_at);
