const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dfd6k18qz",
  api_key: "626176296741866",
  api_secret: "DSdllp9WAB1EYEdlF_GsEFOmvoM",
});

function uploadToCloudinary(filePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}
exports.uploadToCloudinary = uploadToCloudinary;
