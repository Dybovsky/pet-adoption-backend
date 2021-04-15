const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", require("./routes/users"));

const port = "5500";
const host = "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}`);
});
