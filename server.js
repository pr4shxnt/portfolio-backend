const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Database/DBconnect');
const serverless = require('serverless-http');

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 connectDB();

 app.use('/api/projects', require('./Routes/projectRoutes'));

 if (process.env.NODE_ENV === 'production') {
   module.exports.handler = serverless(app);
} else {
   app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
