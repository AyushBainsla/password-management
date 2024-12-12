const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/passwords', require('./routes/passwordRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Error handling middleware
app.use(require('./middlewares/errorMiddleware'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
