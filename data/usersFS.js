const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "users.json");

async function readMyFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, buffer) => {
      if (err) reject(err);
      else resolve(JSON.parse(buffer.toString()));
    });
  });
}

exports.readMyFile = readMyFile;

async function writeToFile(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

exports.writeToFile = writeToFile;

async function addUser(user) {
  const users = await readMyFile();
  users.push(user);
  await writeToFile(users);
}

exports.addUser = addUser;
