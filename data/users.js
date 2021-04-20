const { query } = require("../lib/database");
const SQL = require("@nearform/sql");

function addUser(
  email,
  passwordHash,
  passwordHashCheck,
  firstName,
  lastName,
  phone
) {
  return query(
    SQL`INSERT INTO users (email, password_hash, password_hash_check, phone, firstName, lastName) VALUES (${email}, ${passwordHash}, ${passwordHashCheck}, ${phone}, ${firstName}, ${lastName})`
  );
}

exports.addUser = addUser;
