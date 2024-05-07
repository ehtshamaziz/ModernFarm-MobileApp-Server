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
const UploadMultiImagesMulter = upload.array('images', 6);  // Allow up to 10 images, adjust as needed

const UploadMultiImages = async (req, res, next) => {
  try {
    const imageUrls = req.files.map(file => file.path);  // Access `req.files` instead of `req.file`
    console.log("Image URLs: ", imageUrls);
    return res.status(200).send(imageUrls);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  UploadMultiImagesMulter,
  UploadMultiImages,
};
