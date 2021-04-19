const SQL = require("@nearform/sql");
const { query } = require("../lib/database");

function getPets() {
  return query(SQL`SELECT * FROM pets`);
}

exports.getPets = getPets;

function addPet(
  name,
  breed,
  type,
  status,
  picture,
  height,
  weight,
  color,
  bio,
  allergy,
  diet
) {
  const sql = SQL`INSERT INTO pets (name, breed, type, status, picture, height, weight, color, bio, allergy, diet) VALUES (${name}, ${breed}, ${type}, ${status}, ${picture}, ${height}, ${weight}, ${color}, ${bio}, ${allergy}, ${diet})`;
  return query(sql);
}
exports.addPet = addPet;
