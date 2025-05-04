import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/dbConfig.js';
import 'dotenv/config';


const app = express();
const port = process.env.PORT || 5000;

// Allow multiple origin
const allowedOrigins = [
  "http://localhost:8080",
  process.env.FRONTEND_URL 
];


// Connect to MongoDB
await connectDB();

// Connect to Cloudinary
await connectCloudinary(); 

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());



// Define routes



// Health check route
app.get('/', (req, res) => {
  res.send("Ecommerce API is working");
});


// Error handling middleware (should be the last middleware)
app.use(errorHandler);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
