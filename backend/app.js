/**
 * AgriQura AI Express Application
 * Lead Developer & Owner: GVignesh
 * GitHub: https://github.com/GVignesh777
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const env = require('./config/env');

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS for frontend on port 3377
app.use(
  cors({
    origin: [env.clientUrl, 'http://localhost:3377', 'http://127.0.0.1:3377'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root info endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'AgriQura AI Backend API',
    developer: 'GVignesh',
    owner: 'GVignesh',
    github: 'https://github.com/GVignesh777',
    status: 'Operational',
    version: '1.0.0'
  });
});

// General Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'AgriQura API',
    developer: 'GVignesh',
    owner: 'GVignesh',
    github: 'https://github.com/GVignesh777',
    status: 'Operational',
    timestamp: new Date().toISOString()
  });
});

// Route imports (placeholder mounts for core routes)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/farms', require('./routes/farmRoutes'));
app.use('/api/assistant', require('./routes/assistantRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/disease', require('./routes/diseaseRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));
app.use('/api/soil', require('./routes/soilRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/expert', require('./routes/expertRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/consent', require('./routes/consentRoutes'));
app.use('/api/help', require('./routes/helpRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/voice', require('./routes/voiceRoutes'));

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
