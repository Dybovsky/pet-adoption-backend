const { getUserById } = require("../data/users");

async function isAdmin(req, res, next) {
  const user = await getUserById(req.user.id);
  if (user.role !== "admin") {
    res.status(403).send({ message: "Only admin can access" });
    return;
  }
  next();
}
exports.isAdmin = isAdmin;
