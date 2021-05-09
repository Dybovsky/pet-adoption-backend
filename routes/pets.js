const express = require("express");
const router = express.Router();
const fs = require("fs");

const { uploadToCloudinary } = require("../lib/cloudinary");

const {
  getPets,
  addPet,
  getPetsByUserId,
  getPetById,
  deletePetById,
  updatePetPicture,

  addOwner,
  changeStatus,
  returnPet,

  getPetsByAdvSearch,
  savePet,
  unsavePet,
  getSavedPets,
  getAuthPets,
} = require("../data/pets");

const { isAdmin } = require("../middlewares/admin");
const { upload } = require("../middlewares/multipart");
const getValMiddleware = require("../middlewares/validation");
const { auth } = require("../middlewares/auth");
const { NewPetValSchema } = require("./petSchema");
const { getUserById } = require("../data/users");

// get all pets
router.get("/", async (req, res, next) => {
  try {
    const results = await getPets();
    res.send({ pets: results });
  } catch (err) {
    next(err);
  }
});

router.get("/all_pets/", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const results = await getAuthPets(userId);
    res.send({ pets: results });
  } catch (err) {
    next(err);
  }
});

//add pet
router.post(
  "/",
  getValMiddleware(NewPetValSchema),
  auth,
  isAdmin,
  upload.single("image"),
  async (req, res, next) => {
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

      res.status(201).send(`Pet ${name} added`);
    } catch (err) {
      next(err);
    }
  }
);

function isSameUser(req, res, next) {
  if (req.user.id !== req.params.userId) {
    res.status(403).send({ message: "Only the same user can access" });
    return;
  }
  next();
}
//
router.put(
  "/picture/:petID",

  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const result = await uploadToCloudinary(req.file.path);

      await updatePetPicture(req.params.petID, result.secure_url);
      fs.unlinkSync(req.file.path);
      res.send({ picture: result.secure_url });
    } catch (err) {
      console.error(err);
    }
  }
);

//show my pets
router.get("/user/my", auth, async (req, res, next) => {
  try {
    const userId = req.user.id;

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

    const usersPets = await getPetsByUserId(userId);
    res.send({ usersPets });
  } catch (err) {
    next(err);
  }
});

//delete pet by id

router.delete("/:petId", auth, async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
  }
});

// get pet bi id
router.get("/getPet/:petId", async (req, res) => {
  try {
    const { petId } = req.params;
    const response = await getPetById(petId);

    res.send({ response });
  } catch (err) {
    console.error(err);
  }
});

// edit pet
router.put(
  "/:petId",
  auth,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { editedPet } = req.body;
      const { petId } = req.params;

      res.send({ response });
    } catch (err) {
      console.error(err);
    }
  }
);

//foster adopt return api

router.post("/take_pet/:petId/:status", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { petId, status } = req.params;

    addOwner(petId, userId);
    changeStatus(petId, status);

    res.status(201).send(`user ${userId} now own this pet`);
  } catch (err) {
    console.log(err);
  }
});

router.post("/return/:petId/", auth, async (req, res) => {
  try {
    const { petId } = req.params;

    returnPet(petId);
    res.status(201).send(`pet returned`);
  } catch (err) {
    console.log(err);
  }
});

router.get("/query", async (req, res) => {
  try {
    const response = await getPetsByAdvSearch(req.query);

    res.send(response);
  } catch (err) {
    console.error(err);
  }
});

router.post("/save/:petId/", auth, async (req, res) => {
  try {
    const { petId } = req.params;
    const userId = req.user.id;
    const { id } = req.body;
    savePet(id, userId, petId);
    res.send({ id });
  } catch (err) {
    console.error(err);
  }
});

router.delete("/unsave/:id/", auth, async (req, res) => {
  try {
    const { id } = req.params;
    unsavePet(id);
  } catch (err) {
    console.error(err);
  }
});

router.get("/saved_pets/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const response = await getSavedPets(userId);

    res.send(response);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
