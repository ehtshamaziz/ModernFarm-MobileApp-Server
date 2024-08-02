const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// SETUP CLOUDINARY STORAGE WITH MULTER
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    return {
      folder: "ModernFarm",
      resource_type: "auto",
      public_id: file.originalname.split(".")[0],
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
