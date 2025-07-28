CREATE TABLE lesson(
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    video_data TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_course_id
        FOREIGN KEY (course_id)
        REFERENCES course(id)
        ON DELETE CASCADE

);