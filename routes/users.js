const express = require("express");
//const { readMyFile, addUser } = require("../data/users");
const router = express.Router();
const { NewUserValSchema } = require("./usersSchemas");
const getValMiddleware = require("../middlewares/validation");

const bcrypt = require("bcrypt");
const { addUser, getUserByEmail, getUsers } = require("../data/users");

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
  const { email } = req.params;
  try {
    const user = await getUserByEmail(email);
    res.send({ user });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/signup",
  //getValMiddleware(NewUserValSchema),
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
      // const newUser = {
      //   id: Date.now(),
      //   firstName,
      //   lastName,
      //   email,
      //   phone,
      //   password,
      //   passwordCheck,
      //   dateCreated: Date.now(),
      // };
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) next(err);
        else {
          await addUser(email, hash, hash, phone, firstName, lastName);
          res.send({ user: { email } });
        }
      });
      //res.send({ user: newUser });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) return;
  bcrypt.compare(password, user.password_hash, (err, result) => {
    if (err) next(err);
    else {
      if (result) {
        res.send({
          user: {
            email: user.email,
            created_date: user.created_date,
            id: user.id,
          },
        });
      } else {
        res.status(401).send("Incorrect password");
      }
    }
  });
});

module.exports = router;

// router.post(
//   "/signup",
//   getValMiddleware(NewUserValSchema),
//   async (req, res, next) => {
//     try {
//       const {
//         firstName,
//         lastName,
//         email,
//         phone,
//         password,
//         passwordCheck,
//       } = req.body;
//       const newUser = {
//         id: Date.now(),
//         firstName,
//         lastName,
//         email,
//         phone,
//         password,
//         passwordCheck,
//         dateCreated: Date.now(),
//       };
//       //await addUser(newUser);
//       res.send({ user: newUser });
//     } catch (err) {
//       next(err);
//     }
//   }
// );
