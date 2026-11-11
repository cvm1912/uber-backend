const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors');

// Load environment variables first so configs can read them
dotenv.config();

//imports 
const connectDatabase = require('./src/configs/dbConfig');
const logger = require('./src/configs/loggerConfig');
const pingRouter = require('./src/routes/ping-routes');


// Initialize Express application
const app = express();

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', pingRouter);

// Home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Uber Backend API"
    });
});

// Connect to database then start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    logger.info(`Server is running on port http://localhost:${PORT}`);
  });
};

startServer();
