const express = require("express");
const router = express.Router();

const { pool, query } = require("../lib/database");
const {
  getPets,
  addPet,
  getPetsByUserId,
  getPetById,
  deletePetById,
} = require("../data/pets");
const getValMiddleware = require("../middlewares/validation");
const { NewPetValSchema } = require("./petSchema");
const { auth } = require("../middlewares/auth");
const { getUserById } = require("../data/users");

//get all pets
router.get("/", async (req, res, next) => {
  try {
    const results = await getPets();
    res.send({ pets: results });
  } catch (err) {
    next(err);
  }
});

//add pet
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

//save pet
// router.put(':id/save', async(req, res, next) => {
//   try{
//     const { id } = req.params;
//     const result = savePet(id, //?userId)
//   }catch(err){
//     next(err)
//   }
// })

//show my pets
router.get("/user/my", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(111, userId);
    const usersPets = await getPetsByUserId(userId);

    res.send({ usersPets });
  } catch (err) {
    next(err);
  }
});

//show user pet by id
//‘/pet/user/:id
router.get("/user/:id", auth, async (req, res, next) => {
  try {
    const userId = req.params;
    //req.user.id;
    console.log(222, userId);
    const usersPets = await getPetsByUserId(userId);
    res.send({ usersPets });
  } catch (err) {
    next(err);
  }
});

//delete pet by id
//make return intead of del
router.delete("/:petId", auth, async (req, res) => {
  const userId = req.user.id;
  const { petId } = req.params;
  const pet = await getPetById(petId);
  const user = await getUserById(userId);
  const canDeletePet = pet.Owner_id === userId || user.role === "admin";
  if (!canDeletePet) {
    res.status(403).send({ message: "Only owner can delete" });
  }
  await deletePetById(petId);
  res.send({ message: "deleted" });
});

module.exports = router;
