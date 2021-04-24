const { getUserById } = require("../data/users");

async function isAdmin(req, res, next) {
  console.log(req.user);
  const user = await getUserById(userId);
  if (user.role !== "admin") {
    res.status(403).send({ message: "Only admin can access" });
    return;
  }
  next();
}
exports.isAdmin = isAdmin;
