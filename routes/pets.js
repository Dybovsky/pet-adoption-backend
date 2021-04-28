const express = require("express");
const router = express.Router();
const fs = require("fs");

const { uploadToCloudinary } = require("../lib/cloudinary");
const { pool, query } = require("../lib/database");
const {
  getPets,
  addPet,
  getPetsByUserId,
  getPetById,
  deletePetById,
  updatePetPicture,
  updatePet,
  addOwner,
} = require("../data/pets");
//const { host, port } = require("../server");
const { isAdmin } = require("../middlewares/admin");
const { upload } = require("../middlewares/multipart");
const getValMiddleware = require("../middlewares/validation");
const { auth } = require("../middlewares/auth");
const { NewPetValSchema } = require("./petSchema");
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

// app.post("/uploadFile", upload.single("my_file"), async (req, res) => {
//   res.send("uploaded");
// });

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
      // console.log("posted");
      res.status(201).send(`Pet ${name} added`);
    } catch (err) {
      next(err);
    }
  }
);

//or isAdmin middleware must use for chnge user settings
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
  // "/:userId/picture",
  // isSameUser 40 min
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      // console.log("req", req.params);
      const result = await uploadToCloudinary(req.file.path);
      // console.log(result, "res");
      await updatePetPicture(req.params.petID, result.secure_url);
      fs.unlinkSync(req.file.path);
      res.send({ picture: result.secure_url });
    } catch (err) {
      console.error(err);
    }
  }
  // frontend formData.append
);

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

    const usersPets = await getPetsByUserId(userId);
    res.send({ usersPets });
  } catch (err) {
    next(err);
  }
});

//delete pet by id
//make return intead of del
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

//get pet bi id
router.get("/:petId", auth, async (req, res) => {
  try {
    const { petId } = req.params;
    const response = await getPetById(petId);
    // console.log(response, "resp");
    res.send({ response });
  } catch (err) {
    console.error(err);
  }
});

//edit pet
router.put(
  "/:petId",
  auth,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { editedPet } = req.body;
      const { petId } = req.params;
      console.log("body", req.body);
      const response = await updatePet(petId, editedPet);
      // console.log(response, "resp");
      res.send({ response });
    } catch (err) {
      console.error(err);
    }
  }
);

//foster adopt return api

router.post("/:petId/adopt", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { petId } = req.params;
    //const pet = await getPetById(petId)
    addOwner(petId, userId);

    res.status(201).send(`user ${userId} now own this pet`);
    //addToMyPets(petId)
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
