CREATE TABLE course (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10,2) Default 0,
    img_data BYTEA,
    instructor_id UUID NOT NULL,
    category_id INTEGER NOT NULL,
    is_published boolean DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_instructor_id
        FOREIGN KEY (instructor_id)
        REFERENCES "user"(id),

    CONSTRAINT fk_category_id
        FOREIGN KEY (category_id)
        REFERENCES category(id)
);
