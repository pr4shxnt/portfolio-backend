const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Database/DBconnect');
const serverless = require('serverless-http');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/projects', require('./Routes/projectRoutes'));

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

let handler;

if (process.env.NODE_ENV === 'production') {
  // Initialize database connection
  connectDB().then(() => {
    console.log('Database connected in production mode');
  }).catch(err => {
    console.error('Database connection error:', err);
  });
  
  handler = serverless(app);
  module.exports.handler = async (event, context) => {
    // Make context callbackWaitsForEmptyEventLoop = false to prevent timeout
    context.callbackWaitsForEmptyEventLoop = false;
    return await handler(event, context);
  };
} else {
  // Development mode
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
