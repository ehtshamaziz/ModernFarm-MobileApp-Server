require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/database");
const globalAuthMiddleware = require("./middleware/globalAuth");
const { errorHandler, notFound } = require("./middleware/errorHandlers.js");
const {
  UploadImageMulter,
  UploadImage,
  UploadMultiImagesMulter,
  UploadMultiImages,
} = require("./middleware/image");

// Import routes
const userRoutes = require("./routes/user-routes");
const adminRoutes = require("./routes/admin-routes");
const farmRoutes = require("./routes/farm-routes");
const productRoutes = require("./routes/product-routes");
const contactRoutes = require("./routes/contact-routes");
const specieRoutes = require("./routes/specie-routes");
const birdRoutes = require("./routes/bird-routes");
const coupleRoutes = require("./routes/couple-routes");
const clutchRoutes = require("./routes/clutch-routes");
const eggRoutes = require("./routes/egg-routes.js");
const diseaseRoutes = require("./routes/disease-route.js");
const treatmentRoutes = require("./routes/treatment-routes.js");
const taskRoutes = require("./routes/tasks-routes.js");
const nutritionRoutes = require("./routes/nutrition-routes.js");
const workerRoutes = require("./routes/worker-routes.js");
const financeRoutes = require("./routes/finance-routes.js");
const farmNotesRoutes = require("./routes/farm-note-routes.js");
const marketRoutes = require("./routes/market-routes.js");
const subscriptionRoutes = require("./routes/subscription-routes.js");
const questionRoutes = require("./routes/question-routes.js");
const generalSettingRoutes = require("./routes/general-setting-routes.js");
const backupRoutes = require("./routes/backup-routes.js");

const app = express();

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

// Global Authentication middleware
app.use(globalAuthMiddleware);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success" });
});

// Routes
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/farm", farmRoutes);
app.use("/product", productRoutes);
app.use("/contact", contactRoutes);
app.use("/specie", specieRoutes);
app.use("/bird", birdRoutes);
app.use("/couple", coupleRoutes);
app.use("/clutch", clutchRoutes);
app.use("/egg", eggRoutes);
app.use("/disease", diseaseRoutes);
app.use("/treatment", treatmentRoutes);
app.use("/task", taskRoutes);
app.use("/nutrition", nutritionRoutes);
app.use("/worker", workerRoutes);
app.use("/finance", financeRoutes);
app.use("/farm-note", farmNotesRoutes);
app.use("/market", marketRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/question", questionRoutes);
app.use("/general-setting", generalSettingRoutes);
app.use("/backup-restore", backupRoutes);

// Image Upload Endpoints
app.post("/image/upload", UploadImageMulter, UploadImage);
app.post("/multi-images/upload", UploadMultiImagesMulter, UploadMultiImages);

// Error handling - Not Found
app.use(notFound);

// Global Error Handling
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
