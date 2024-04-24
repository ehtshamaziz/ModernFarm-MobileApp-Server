const Product = require("../models/product");
// const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

//        ********** FUNCTIONS ***********

// GET ALL PRODUCTS
const GetProducts = async (req, res, next) => {
  console.log("Get all products");
  try {
    const product = await Product.find().populate("farm","farmName farmType");
    return res.status(200).send(product);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE PRODUCT
const GetProductByID = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("farm","farmName farmType");
    return res.status(200).send(product);
  } catch (err) {
    next(err);
  }
};

// GET ALL PRODUCTS FOR A SPECIFIC USER
const GetUserProducts = async (req, res, next) => {
  console.log("Get all user products");
  try {
    const products = await Product.find({ user: req.params.id }).populate("farm","farmName farmType");
    return res.status(200).send(products);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW PRODUCT
const CreateProduct = async (req, res, next) => {
  const product = new Product(req.body);
  console.log(req.body);
  try {
    await product.save();
    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};
// https://res.cloudinary.com/dqnz3rzt5/image/upload/v1705765421/ModernFarm/zsyp6lmzqllowy7bbuwp.webp

// UPDATE PRODUCT
const UpdateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

// DELETE PRODUCT
const DeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetProducts,
  GetProductByID,
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  GetUserProducts,
};
