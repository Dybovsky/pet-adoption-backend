
CREATE TABLE IF NOT EXISTS pets (
  id            VARCHAR(36) DEFAULT (UUID()),
  name          VARCHAR(200) NOT NULL,
  breed         VARCHAR(200) NOT NULL,
  type          VARCHAR(200) NOT NULL,
  status        VARCHAR(200) NOT NULL,
  picture       VARCHAR(200) NOT NULL,
  height        INT NOT NULL,
  weight        INT NOT NULL,
  color         VARCHAR(200) NOT NULL,
  bio           VARCHAR(200) NOT NULL,
  allergy       VARCHAR(200) NOT NULL,
  diet          VARCHAR(200) NOT NULL, 
  created_date  DATE DEFAULT (CURRENT_DATE),
  PRIMARY KEY (id)
)