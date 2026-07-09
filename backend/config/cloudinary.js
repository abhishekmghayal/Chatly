console.log("CLOUDINARY CONFIG FILE STARTED");

const cloudinary = require("cloudinary").v2;

console.log("PACKAGE IMPORTED");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("CONFIG DONE");

console.log(cloudinary.config());

module.exports = cloudinary;
