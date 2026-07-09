const multer = require("multer");

const storage = multer.memoryStorage();
// file RAM me store hoga (not disk, not cloud)

const upload = multer({ storage });

module.exports = { singleUpload: multer({ storage }).single("profilePicture") };
module.exports = { singleUpload: multer({ storage }).single("image") };
