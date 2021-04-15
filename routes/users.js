const express = require("express");
const { readMyFile, addUser } = require("../data/users");
const router = express.Router();
const { NewUserValSchema } = require("./usersSchemas");
const getValMiddleware = require("../middlewares/validation");

//get /users/
router.get("/", async (req, res, next) => {
  try {
    const users = await readMyFile();
    res.send({ users });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/signup",
  getValMiddleware(NewUserValSchema),
  async (req, res, next) => {
    try {
      const { text } = req.body;
      const newUser = {
        id: Date.now(),
        text,
        dateCreated: Date.now(),
      };
      await addUser(newUser);
      res.send({ user: newUser });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
