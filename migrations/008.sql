CREATE TABLE lesson_progress(
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    lesson_id INTEGER NOT NULL,
    is_finished BOOLEAN DEFAULT FALSE,
    finished_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lesson_id
        FOREIGN KEY (lesson_id)
        REFERENCES lesson(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_id
        FOREIGN KEY(user_id)
        REFERENCES "user"(id)
)