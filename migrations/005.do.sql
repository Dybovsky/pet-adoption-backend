CREATE TABLE IF NOT EXISTS users (
    id        VARCHAR(36) DEFAULT (UUID()),
    email     VARCHAR(255) NOT NULL UNIQUE,
    firstName VARCHAR(255) NOT NULL,
    lastName  VARCHAR(255) NOT NULL,
    phone     VARCHAR(255) NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    password_hash_check  VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
)
