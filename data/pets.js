const SQL = require("@nearform/sql");
const { query } = require("../lib/database");

function getPets() {
  return query(SQL`SELECT * FROM pets`);
}

exports.getPets = getPets;

function getAuthPets(userId) {
  return query(
    SQL`SELECT pets.* ,CASE WHEN sp.user_id IS null THEN false ELSE true END AS saved FROM pets LEFT JOIN saved_pets AS sp ON pets.id = sp.pet_id AND sp.user_id = ${userId}`
  );
}

exports.getAuthPets = getAuthPets;

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

function getPetsByUserId(userId) {
  const sql = SQL`SELECT pets.* ,CASE WHEN sp.user_id IS null THEN false ELSE true END AS saved FROM pets LEFT JOIN saved_pets AS sp ON pets.id = sp.pet_id AND sp.user_id = ${userId} WHERE Owner_id = ${userId}`;
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

async function updatePetPicture(petId, picture) {
  const sql = await SQL`UPDATE pets SET picture = ${picture} WHERE id = ${petId}`;
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

function addOwner(petId, userId) {
  const sql = SQL`UPDATE pets SET Owner_Id = ${userId} WHERE id = ${petId}`;
  return query(sql);
}
exports.addOwner = addOwner;

function changeStatus(petId, status) {
  const sql = SQL`UPDATE pets SET status = ${status} WHERE id = ${petId}`;
  return query(sql);
}
exports.changeStatus = changeStatus;

function returnPet(petId) {
  const sql = SQL`UPDATE pets SET status = "Take me!", Owner_Id = null WHERE id = ${petId}`;
  return query(sql);
}
exports.returnPet = returnPet;

function getPetsByAdvSearch(searchObj) {
  const sql = SQL`SELECT * FROM pets WHERE `;
  const { type, status, height, weight, name } = searchObj;
  const updates = [];
  if (type !== "") updates.push(SQL`type = ${type}`);
  if (status !== "") updates.push(SQL`status = ${status}`);
  if (name !== "") updates.push(SQL`name = ${name}`);
  if (weight != "0") updates.push(SQL`weight = ${weight}`);
  if (height != "0") updates.push(SQL`height = ${height}`);

  sql.append(sql.glue(updates, " AND "));

  return query(sql);
}
exports.getPetsByAdvSearch = getPetsByAdvSearch;

function savePet(id, userId, petId) {
  const sql = SQL`INSERT INTO saved_pets (id, user_id, pet_id) VALUES (${id}, ${userId}, ${petId})`;
  return query(sql);
}
exports.savePet = savePet;

function unsavePet(id) {
  const sql = SQL`DELETE FROM saved_pets WHERE id = ${id}`;
  return query(sql);
}
exports.unsavePet = unsavePet;

function getSavedPets(userId) {
  const sql = SQL`SELECT pets.* ,CASE WHEN sp.user_id IS null THEN false ELSE true END AS saved FROM pets JOIN saved_pets AS sp ON pets.id = sp.pet_id  WHERE user_id = ${userId}`;

  return query(sql);
}
exports.getSavedPets = getSavedPets;
