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

function getPetById(id) {
  const sql = SQL`SELECT * FROM pets WHERE id = ${id}`;
  return query(sql);
}
exports.getPetById = getPetById;

function deletePetById(id) {
  const sql = SQL`DELETE FROM pets WHERE id = ${id}`;
  return query(sql);
}
exports.deletePetById = deletePetById;

function updatePetPicture(petId, picture) {
  const sql = SQL`UPDATE pets SET picture = ${picture} WHERE id = ${petId}`;
  return query(sql);
}
exports.updatePetPicture = updatePetPicture;

function updatePet(petId, editedPet) {
  const {
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
    diet,
  } = editedPet;
  const sql = SQL`UPDATE pets SET name = ${name}, breed = ${breed},
  type = ${type},
  status = ${status},
  picture = ${picture},
  height = ${height},
  weight = ${weight},
  color = ${color},
  bio = ${bio},
  allergy = ${allergy},
  diet = ${diet}
  WHERE id = ${petId}`;
  return query(sql);
}
exports.updatePet = updatePet;
