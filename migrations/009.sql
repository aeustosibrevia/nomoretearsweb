CREATE TABLE enrollment (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    course_id INTEGER NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress_percent DECIMAL(5,2) DEFAULT 0,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES "user"(id),

    CONSTRAINT fk_course
        FOREIGN KEY (course_id)
        REFERENCES course(id)
        ON DELETE CASCADE,

    CONSTRAINT uc_user_course UNIQUE (user_id, course_id)
);
