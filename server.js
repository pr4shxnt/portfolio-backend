const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Database/DBconnect');
const serverless = require('serverless-http');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/api/projects', require('./Routes/projectRoutes'));

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Create handler with specific configuration
const handler = serverless(app, {
  callbackWaitsForEmptyEventLoop: false
});

// Export the serverless handler
module.exports = handler;
