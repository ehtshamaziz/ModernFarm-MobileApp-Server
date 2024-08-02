const upload = require("../utils/fileUpload");

const UploadImageMulter = upload.single("image");
const UploadMultiImagesMulter = upload.array("images", 10);

const UploadImage = async (req, res, next) => {
  try {
    const imageURL = req.file.path;
    return res.status(200).send(imageURL);
  } catch (err) {
    next(err);
  }
};

const UploadMultiImages = async (req, res, next) => {
  try {
    const imageUrls = req.files.map((file) => file.path); // Access `req.files` instead of `req.file`
    return res.status(200).send(imageUrls);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  UploadImageMulter,
  UploadImage,
  UploadMultiImagesMulter,
  UploadMultiImages,
};
