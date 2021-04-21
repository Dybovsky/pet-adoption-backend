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
} = require("../data/users");

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
  getValMiddleware(NewUserValSchema), //dont work proper
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
  }
  bcrypt.compare(password, user.password_hash, (err, result) => {
    if (err) next(err);
    else {
      if (result) {
        const token = jwt.sign({ id: user.id }, "stringforcrypting");
        res.send({
          token,
          user: {
            email: user.email,
            //created_date: user.created_date,
            id: user.id,
          },
        });
      } else {
        res.status(401).send("Incorrect password");
      }
    }
  });
});

router.put("/:id", async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send({ message: "Must provide auth header" });
    return;
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, "stringforcrypting", async (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Invalid token" });
      return;
    }
    const { id } = req.params;
    try {
      res.json(await updateUser(id, req.body.updatedUser));
    } catch (err) {
      next(err);
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
