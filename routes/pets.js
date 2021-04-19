const express = require("express");
const router = express.Router();

const { pool, query } = require("../lib/database");
const SQL = require("@nearform/sql");
const { getPets, addPet } = require("../data/pets");

// query(
//   `CREATE TABLE IF NOT EXISTS pets (
//   id            VARCHAR(36) DEFAULT (UUID()),
//   name_new          VARCHAR(200) NOT NULL,
//   price         INT NOT NULL,
//   created_date  DATE DEFAULT (CURRENT_DATE),
//   PRIMARY KEY (id)
// )`
// )
//   .then(() => {
//     console.log("i created a table");
//   })
//   .catch((err) => {
//     console.error(err);
//   });

router.get("/", async (req, res, next) => {
  const results = await getPets();
  res.send({ pets: results });

  // try {
  //   res.send("get pet works");
  // } catch {
  //   next(err);
  // }
});

router.post("/", async (req, res, next) => {
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
  } = req.body.pet;

  await addPet(
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
  );
  res.send(`Pet ${name} added`);
  // try {
  //   res.send("post pet works");
  // } catch {
  //   next(err);
  // }
});

module.exports = router;
