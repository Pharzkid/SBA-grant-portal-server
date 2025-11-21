import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import seedAdmin from './config/seedAdmin.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Will be used for dashboard data
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// Connect to MongoDB
connectDB();
seedAdmin();

const app = express();

// Middleware
app.use(express.json()); // Allows parsing of JSON request body

// CORS configuration (Allows frontend to talk to backend)
const allowedOrigins = [process.env.CLIENT_URL]; 
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);


// Default route for testing
app.get('/', (req, res) => {
    res.send('SBA Grant Portal API is running...');
});

// Error Handling Middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

// Utility function for graceful error handling (if needed)
//function errorHandler(err, req, res, next) {
 //   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
 //   res.status(statusCode);
   // res.json({
     //   message: err.message,
       // stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    //});
//}