/*
AI Comments to increase Understanding
This file starts the Node/Express server for the LOS calculator app.
Data flow: browser requests -> Express routes (`/api`) -> MongoDB queries -> JSON responses -> browser UI updates.
It also serves static frontend files from `public` and handles startup/shutdown lifecycle events.
*/
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hawaii_tourism';
// AI Alteration: Improved MongoDB availability handling
const MAX_DB_CONNECT_RETRIES = 5;
// AI Alteration: Improved MongoDB availability handling
const DB_RETRY_DELAY_MS = 3000;
// AI Alteration: Improved MongoDB availability handling
let isDbAvailable = false;
// AI Alteration: Improved MongoDB availability handling
let serverStarted = false;

// Middleware
// These middleware parse request bodies and allow cross-origin calls to this API.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
// All API endpoints are mounted under `/api` in `routes/api.js`.
// AI Alteration: Improved MongoDB availability handling
app.use('/api', (req, res, next) => {
  if (!isDbAvailable || mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: {
        message: 'Service temporarily unavailable. Please try again shortly.',
        code: 'DB_UNAVAILABLE'
      }
    });
  }
  next();
});
app.use('/api', apiRoutes);

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
/*
AI Analysis: Core Vulnerability
Issue: the app exits immediately if MongoDB is unavailable.
Why it matters: one outage can stop all API access and reduce reliability.
Where: initial `mongoose.connect(...)` startup block in this file.
Later fix idea: add retry/backoff logic and health checks instead of immediate process exit.
*/
// AI Alteration: Improved MongoDB availability handling
function startServerIfNeeded() {
  if (serverStarted) {
    return;
  }
  serverStarted = true;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// AI Alteration: Improved MongoDB availability handling
async function connectWithRetry(attempt = 1) {
  try {
    await mongoose.connect(MONGODB_URI);
    isDbAvailable = true;
    console.log('Connected to MongoDB');
    startServerIfNeeded();
  } catch (error) {
    isDbAvailable = false;
    console.error(`MongoDB connection error (attempt ${attempt}/${MAX_DB_CONNECT_RETRIES}):`, error);
    if (attempt >= MAX_DB_CONNECT_RETRIES) {
      console.error('Max MongoDB connection attempts reached. API will return 503 until connection is restored.');
      startServerIfNeeded();
      return;
    }
    setTimeout(() => {
      connectWithRetry(attempt + 1);
    }, DB_RETRY_DELAY_MS);
  }
}

// AI Alteration: Improved MongoDB availability handling
mongoose.connection.on('connected', () => {
  isDbAvailable = true;
});

// AI Alteration: Improved MongoDB availability handling
mongoose.connection.on('disconnected', () => {
  isDbAvailable = false;
  console.warn('MongoDB disconnected. API requests will receive 503 until reconnection.');
});

// AI Alteration: Improved MongoDB availability handling
mongoose.connection.on('error', (error) => {
  isDbAvailable = false;
  console.error('MongoDB runtime error:', error);
});

connectWithRetry();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('\nMongoDB connection closed');
  process.exit(0);
});
