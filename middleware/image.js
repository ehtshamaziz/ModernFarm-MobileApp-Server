const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// SETUP CLOUDINARY STORAGE WITH MULTER
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ModernFarm",
    format: async (req, file) => "jpg",
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

const UploadImageMulter = upload.single("image");

const UploadImage = async (req, res, next) => {
  try {
    const imageURL = req.file.path;
    console.log("Image URL: ", imageURL);
    return res.status(200).send(imageURL);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  UploadImageMulter,
  UploadImage,
};
