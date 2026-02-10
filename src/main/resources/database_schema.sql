CREATE DATABASE getalife;

CREATE TABLE categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE hobbies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    min_price INT NOT NULL DEFAULT 0,
    max_price INT NOT NULL,
    description TEXT NOT NULL,
    -- image TODO: image

    FOREIGN KEY (category_id) REFERENCES categories(id),
    CHECK (min_price <= max_price)
);

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    registration_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- image
);

CREATE TABLE hobby_ratings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    hobby_id uuid NOT NULL,
    user_id uuid NOT NULL,
    rating INT NOT NULL CHECK ( rating BETWEEN 1 AND 5 ),

    UNIQUE (user_id, hobby_id),

    FOREIGN KEY (hobby_id) REFERENCES hobbies(id),
    FOREIGN KEY (user_id)  REFERENCES users(id)
);

CREATE TABLE hobby_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    hobby_id uuid NOT NULL,
    user_id uuid NOT NULL,

    UNIQUE (user_id, hobby_id),

    FOREIGN KEY (hobby_id) REFERENCES hobbies(id),
    FOREIGN KEY (user_id)  REFERENCES users(id)
);

CREATE TABLE user_friends (
    user_id_1 uuid NOT NULL,
    user_id_2 uuid NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id_1, user_id_2),
    CONSTRAINT user_order CHECK (user_id_1 < user_id_2),
    CONSTRAINT fk_user_1 FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_2 FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_wishlist (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    hobby_id uuid NOT NULL,

    UNIQUE (user_id, hobby_id),

    FOREIGN KEY (user_id)  REFERENCES users(id),
    FOREIGN KEY (hobby_id) REFERENCES hobbies(id)
);

CREATE TABLE user_activity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    hobby_id uuid NOT NULL,
    description TEXT NOT NULL,
    date_of TIMESTAMPTZ NOT NULL,
    --image

    FOREIGN KEY (user_id)  REFERENCES users(id),
    FOREIGN KEY (hobby_id) REFERENCES hobbies(id)
);

CREATE TABLE hobby_suggestions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    min_price INT NOT NULL DEFAULT 0,
    max_price INT NOT NULL,
    date_sent TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    FOREIGN KEY (user_id) REFERENCES users(id),
    CHECK (min_price <= max_price)
);







