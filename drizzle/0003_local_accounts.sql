CREATE TABLE local_credentials (
 user_id TEXT PRIMARY KEY REFERENCES users(id),
 login TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL
);
