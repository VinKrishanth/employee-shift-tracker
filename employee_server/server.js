import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/dbConfig.js';
import connectCloudinary from './configs/cloudinaryConfig.js';
import 'dotenv/config';
import employeeRoutes from './routes/employeeRoutes.js'; 
import projectRoutes from './routes/projectRoutes.js'; 


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
app.use('/api/auth', employeeRoutes); 
app.use('/api/auth/project', projectRoutes); 


// Health check route
app.get('/', (req, res) => {
  res.send("Employee Time Tracker API is working");
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
