const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { initializeFirebase } = require('./src/config/firebase');
const ghlRoutes = require('./src/routes/ghl');
const authMiddleware = require('./src/middleware/auth');

// Initialize Firebase Admin
initializeFirebase();

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(authMiddleware);

// Routes
app.use('/ghl', ghlRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR'
    }
  });
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);