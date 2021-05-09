const path = require("path");
const result = require("dotenv").config({
  path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`),
});

if (result.error) {
  throw new Error(result.error);
}

const express = require("express");
const cors = require("cors");
const pino = require("pino-http");

const { postgrator } = require("./lib/database");
const { uploadedFilesFolder } = require("./middlewares/multipart");

const app = express();
app.use(cors());
app.use(express.json());
app.use(pino({ level: process.env.LOG_LEVEL }));

app.use("/users", require("./routes/users"));
app.use("/pet", require("./routes/pets"));
app.use("/" + uploadedFilesFolder, express.static(uploadedFilesFolder));

const port = +process.env.PORT;
const host = process.env.HOST;
exports.port = port;
exports.host = host;

postgrator
  .migrate()
  .then((result) => {
    console.log("migrated sucsessful", result);
  })
  .catch((error) => console.error(error));

app.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}`);
});
