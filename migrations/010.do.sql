ALTER TABLE users ADD COLUMN role VARCHAR(100) DEFAULT 'user'

INSERT INTO users (email, firstName, lastName, phone, password_hash, password_hash_check, role) VALUES ('admin@admin', 'admin', 'admin', 'adminPhone','$2y$12$.XOP9vj8gWVNyquA1g1beu7JbimLNLxon/QILMnZkd8..j5YJKfxu', '$2y$12$.XOP9vj8gWVNyquA1g1beu7JbimLNLxon/QILMnZkd8..j5YJKfxu', 'admin')