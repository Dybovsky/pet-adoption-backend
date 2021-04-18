const express = require("express");
const cors = require("cors");

const { postgrator } = require("./lib/database");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", require("./routes/users"));
app.use("/pet", require("./routes/pets"));

const port = "5500";
const host = "0.0.0.0";

postgrator
  .migrate()
  .then((result) => {
    console.log("migrated sucsessful", result);
  })
  .catch((error) => console.error(error));

app.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}`);
});
