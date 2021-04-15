const Ajv = require("ajv");
const ajv = new Ajv();

function getValMiddleware(schema) {
  const validate = ajv.compile(schema);
  return (req, res, next) => {
    const valid = validate(req.body);
    if (!valid) {
      res.status(400).send({ errors: validate.errors });
    } else {
      next();
    }
  };
}

module.exports = getValMiddleware;
