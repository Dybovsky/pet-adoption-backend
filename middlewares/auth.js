const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).send({ message: "Must provide an auth header" });
    return;
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, "stringforcrypting", async (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Invalid token" });
      return;
    }
    req.user = decoded;
    next();
  });
}

exports.auth = auth;
