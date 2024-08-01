require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cloudinary = require("cloudinary").v2;
// STRIPE_SECRET_KEY=sk_test_51OHpu1BUs4cwQXC7MCSDG9P57C0fGE9E9bbi7KPrnhLPmz8BNa99yfh8Ff4cl8elHDv6QIxI0LrLq9EfvgcFd2to00JDLtsd2o
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const { google } = require('googleapis');

// Import routes
const userRoutes = require("./routes/user-routes");
const farmRoutes = require("./routes/farm-routes");
const productRoutes = require("./routes/product-routes");
const contactRoutes = require("./routes/contact-routes");
const specieRoutes=require("./routes/specie-routes")
const birdRoutes=require("./routes/bird-routes");
const coupleRoutes=require("./routes/couple-routes");
const { UploadImageMulter, UploadImage } = require("./middleware/image");
const { UploadMultiImagesMulter, UploadMultiImages } = require("./middleware/multi-images");

const clutchRoutes=require('./routes/clutch-routes');
const eggRoutes=require('./routes/egg-routes.js');
const diseaseRoutes=require('./routes/disease-route.js');
const treatmentRoutes=require('./routes/treatment-routes.js')
const taskRoutes=require("./routes/tasks-routes.js");
const nutritionRoutes=require("./routes/nutrition-routes.js");
const workerRoutes=require("./routes/worker-routes.js");
const financeRoutes=require("./routes/finance-routes.js");
const farmNotesRoutes=require("./routes/farm-note-routes.js");
const marketRoutes=require("./routes/market-routes.js");
const subscriptionRoutes=require("./routes/subscription-routes.js");
const questionRoutes=require("./routes/question-routes.js");
const generalSettingRoutes=require("./routes/general-setting-routes.js");
const backupRoutes=require("./routes/backup-routes.js");


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
app.use("/specie", specieRoutes);
app.use("/bird",birdRoutes);
app.use("/couple",coupleRoutes);
app.use("/clutch",clutchRoutes);
app.use("/egg",eggRoutes);
app.use("/disease", diseaseRoutes);
app.use("/treatment",treatmentRoutes);
app.use("/task",taskRoutes)
app.use("/nutrition",nutritionRoutes);
app.use("/worker",workerRoutes);
app.use("/finance",financeRoutes);
app.use("/farm-note",farmNotesRoutes);
app.use("/market",marketRoutes);
app.use("/subscription",subscriptionRoutes);
app.use("/question",questionRoutes);
app.use("/general-setting",generalSettingRoutes);
app.use("/backup-restore",backupRoutes);





const axios = require('axios');

var admin = require('firebase-admin');

//     const fs = require('fs');
//     const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
//     // const serviceAccount = JSON.parse(fs.readFileSync(path, 'utf8'));

//   // ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
//   // : require('./path/to/serviceAccountKey.json'); // Fallback for local development

// admin.initializeApp({
//   credential: admin.credential.cert(path),
//   // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
// });


const initializeFirebaseAdmin = async () => {
    try {
        const serviceAccountUrl = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

        // Fetch the service account JSON from the URL
        const response = await axios.get(serviceAccountUrl);
        const serviceAccount = response.data;

        // Initialize Firebase Admin SDK with the fetched credentials
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
            // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
        });

        console.log('Firebase Admin initialized successfully.');
    } catch (error) {
        console.error('Error initializing Firebase Admin:', error);
    }
};

initializeFirebaseAdmin();


app.get("/", (req, res) => {
  res.status(200).json({ message: "Success" });
});

// app.post('/create-payment-intent',async (req,res)=>{
//   try{
// const paymentIntent = await stripe.paymentIntents.create({
//   payment_method_types: ['card'],
//   amount: 1099,
//   currency: 'usd',
// });
// res.status(200).json(paymentIntent)
//   }catch(error){
//     res.status(505).send(JSON.stringify(error))

//   }
// })


app.post("/image/upload", UploadImageMulter, UploadImage);
app.post("/multi-images/upload", UploadMultiImagesMulter, UploadMultiImages);


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
