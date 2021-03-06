const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();
const { NewUserValSchema } = require("./usersSchemas");
const getValMiddleware = require("../middlewares/validation");
const {
  addUser,
  getUserByEmail,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
} = require("../data/users");
const { auth } = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/admin");

//get /users/
router.get("/", async (req, res, next) => {
  try {
    const users = await getUsers();
    res.send({ users });
  } catch (err) {
    next(err);
  }
});

router.get("/:email", async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);
    res.send({ user });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/signup",
  getValMiddleware(NewUserValSchema),
  async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        passwordCheck,
      } = req.body;
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) next(err);
        else {
          await addUser(email, hash, hash, phone, firstName, lastName);
          const user = await getUserByEmail(email);
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

          res.send({ user: { email, token } });
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

//add validation
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    res.status(404).send("No user with this email");
    return;
  } //

  bcrypt.compare(password, user.password_hash, (err, result) => {
    if (err) next(err);
    else {
      if (result) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.send({
          token,
          user: {
            email: user.email,

            id: user.id,
          },
        });
      } else {
        res.status(401).send("Incorrect password");
      }
    }
  });
});

//update User
router.put("/:id", auth, async (req, res, next) => {
  const { id } = req.params;
  bcrypt.hash(req.body.editedUser.password, 10, async (err, hash) => {
    req.body.editedUser.password = hash;
    req.body.editedUser.passwordCheck = hash;

    try {
      res.json(await updateUser(id, req.body.editedUser));
    } catch (err) {
      next(err);
    }
  });
});

router.delete("/:userId", auth, async (req, res) => {
  const curUserId = req.user.id;
  const { userId } = req.params;

  const user = await getUserById(curUserId);
  const canDeleteUser = user.role === "admin";
  if (!canDeleteUser) {
    res.status(403).send({ message: "Only owner can delete" });
  }
  await deleteUser(userId);
  res.send({ message: "deleted" });
});

module.exports = router;
