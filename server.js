const express = require("express");
const cors = require("cors");

const { postgrator } = require("./lib/database");
const { uploadedFilesFolder } = require("./middlewares/multipart");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", require("./routes/users"));
app.use("/pet", require("./routes/pets"));

//
// app.post("/uploadFile", upload.single("my_file"), async (req, res) => {
//   res.send("uploaded");
// });

app.use("/" + uploadedFilesFolder, express.static(uploadedFilesFolder));
//

const port = "5500";
const host = "127.0.0.1";
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
