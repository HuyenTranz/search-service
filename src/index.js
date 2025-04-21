const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const config = require('./config');
const { morganMiddleware, requestLogger, errorLogger } = require('./middleware/logger');
const connectDB = require('./config/database');
const searchRoutes = require('./routes/search.routes');

const app = express();
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use(morganMiddleware);
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});
app.use(limiter);

// Search routes
app.use('/api', searchRoutes);

// Error handling
app.use(errorLogger);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server search server is running on port ${config.port}`);
}); 