const express = require("express");
const router = express.Router();

const { pool, query } = require("../lib/database");
const { getPets, addPet } = require("../data/pets");
const getValMiddleware = require("../middlewares/validation");
const { NewPetValSchema } = require("./petSchema");

router.get("/", async (req, res, next) => {
  const results = await getPets();
  res.send({ pets: results });
});

router.post("/", getValMiddleware(NewPetValSchema), async (req, res, next) => {
  try {
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
    } = req.body;

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
  } catch (err) {
    next(err);
  }
});

module.exports = router;
