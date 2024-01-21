const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    // enum: ["Nutrition", "Medicines", "Farm Tools & Equipment"],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  imageURL: { type: String },
  productForm: { type: String },
  description: { type: String, required: true },
  manufacturerCompany: { type: String, required: true },
  expirationDate: { type: Date },
  dosage: { type: String },
  price: { type: Number, required: true },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
