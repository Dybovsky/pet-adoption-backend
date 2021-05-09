const { query } = require("../lib/database");
const SQL = require("@nearform/sql");

function addUser(
  email,
  passwordHash,
  passwordHashCheck,
  phone,
  firstName,
  lastName
) {
  return query(
    SQL`INSERT INTO users (email, password_hash, password_hash_check, phone, firstName, lastName) VALUES (${email}, ${passwordHash}, ${passwordHashCheck}, ${phone}, ${firstName}, ${lastName})`
  );
}
exports.addUser = addUser;

async function getUserByEmail(email) {
  const rows = await query(SQL`SELECT * FROM users WHERE email=${email}`);
  return rows[0];
}
exports.getUserByEmail = getUserByEmail;

async function getUsers() {
  return query(SQL`SELECT * FROM users`);
}

exports.getUsers = getUsers;

async function updateUser(id, updatedUser) {
  const result = await query(
    SQL`UPDATE users SET firstName = ${updatedUser.firstName}, lastName=${updatedUser.lastName}, email=${updatedUser.email},phone=${updatedUser.phone}, password_hash=${updatedUser.password} WHERE id = ${id}`
  );
}
exports.updateUser = updateUser;

async function getUserById(userId) {
  const rows = await query(SQL`SELECT * FROM users WHERE id=${userId}`);
  return rows[0];
}
exports.getUserById = getUserById;

function deleteUser(id) {
  const sql = SQL`DELETE FROM users WHERE id = ${id}`;
  return query(sql);
}
exports.deleteUser = deleteUser;
