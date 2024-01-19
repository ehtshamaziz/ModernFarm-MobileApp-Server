const express = require("express");
const productController = require("../controllers/product-controller");
const router = express.Router();

// PRODUCT ROUTES

// GET ALL PRODUCTS
router.get("/", productController.GetProducts);

// GET PRODUCT BY ID
router.get("/single/:id", productController.GetProductByID);

// CREATE NEW PRODUCT
router.post("/", productController.CreateProduct);

// UPDATE PRODUCT BY ID
router.patch("/:id", productController.UpdateProduct);

// DELETE PRODUCT BY ID
router.delete("/:id", productController.DeleteProduct);

module.exports = router;
