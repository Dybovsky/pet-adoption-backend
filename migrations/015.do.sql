CREATE TABLE IF NOT EXISTS saved_pets (
  id            VARCHAR(36) DEFAULT (UUID()),
  user_id          VARCHAR(200) NOT NULL,
  pet_id         VARCHAR(200) NOT NULL,
  PRIMARY KEY (id)
)