-- User ≠ Collaborator. Sem roles/RBAC. Hash BCrypt da senha de demo (nunca plaintext).
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_username_unique UNIQUE (username)
);

INSERT INTO users (id, username, password_hash)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'revex',
    '$2b$10$tSRqPYSBEcMpdTw6TNjLvemXcTKWvhB3XQc8JueewDi.wOIdcnNgS'
);
