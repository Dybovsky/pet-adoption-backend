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

async function savePet(petId, userId) {
  const result = await SQL`UPDATE pets SET Saved_by_Id = ${userId} WHERE id = ${petId}`;
}
exports.savePet = savePet;

function getPetsByUserId(userId) {
  // console.log(userId);
  const sql = SQL`SELECT * FROM pets WHERE Owner_id = ${userId}`;
  return query(sql);
}
exports.getPetsByUserId = getPetsByUserId;
