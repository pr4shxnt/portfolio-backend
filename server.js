const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Database/DBconnect');

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();

app.use('/api/projects', require('./Routes/projectRoutes'));


if (process.env.NODE_ENV != 'production') {
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}


module.exports = app;