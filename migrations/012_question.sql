CREATE TYPE question_type_enum AS ENUM ('single_choice', 'multiple_choice');

CREATE TABLE question (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL REFERENCES quiz(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type_enum NOT NULL
);
    