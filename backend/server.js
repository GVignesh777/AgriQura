/**
 * AgriQura AI Backend Server
 * Lead Developer & Owner: GVignesh
 * GitHub: https://github.com/GVignesh777
 * Smart India Hackathon (SIH 2026)
 */

const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

// Validate environment variables
env.validateEnv();

// Connect to MongoDB Atlas (Section 29)
connectDB();

const PORT = env.port || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 [AgriQura Backend Running]: http://localhost:${PORT}`);
  console.log(`👨‍💻 [Developer & Owner]: GVignesh (https://github.com/GVignesh777)`);
  console.log(`📡 [CORS Origin Configured]: ${env.clientUrl}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ [Port Error]: Port ${PORT} is already in use by another instance. Exiting cleanly...`);
    process.exit(1);
  } else {
    console.error(`❌ [Server Error]:`, err.message);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ [Unhandled Rejection Error]: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ [Uncaught Exception]: ${err.message}`);
});
