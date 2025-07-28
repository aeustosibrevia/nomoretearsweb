CREATE TABLE quiz(
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,

    CONSTRAINT fk_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES lesson(id)

);