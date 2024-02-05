require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cloudinary = require("cloudinary").v2;

// Import routes
const userRoutes = require("./routes/user-routes");
const farmRoutes = require("./routes/farm-routes");
const productRoutes = require("./routes/product-routes");
const contactRoutes = require("./routes/contact-routes");
const specieRoutes=require("./routes/specie-routes")
const birdRoutes=require("./routes/bird-routes");
const coupleRoutes=require("./routes/couple-routes");
const { UploadImageMulter, UploadImage } = require("./middleware/image");
const clutchRoutes=require('./routes/clutch-routes');
const eggRoutes=require('./routes/egg-routes.js');
const app = express();

// CONFIGURE CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

// Routes
app.use("/user", userRoutes);
app.use("/farm", farmRoutes);
app.use("/product", productRoutes);
app.use("/contact", contactRoutes);
app.use("/species", specieRoutes);
app.use("/bird",birdRoutes);
app.use("/couple",coupleRoutes);
app.use("/clutch",clutchRoutes);
app.use("/egg",eggRoutes)

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success" });
});

app.post("/image/upload", UploadImageMulter, UploadImage);

// Error handling
app.use((req, res, next) => {
  res.status(404).send("Resource not found");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.name, message: err.message });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
