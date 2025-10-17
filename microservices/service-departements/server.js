require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db');
const controller = require('./controller');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Départements Service',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.get('/api/departements', controller.getAllDepartements);
app.get('/api/departements/:id', controller.getDepartementById);
app.post('/api/departements', controller.createDepartement);
app.put('/api/departements/:id', controller.updateDepartement);
app.delete('/api/departements/:id', controller.deleteDepartement);

// Error handler
app.use((err, req, res, next) => {
  console.error('[Service Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
const startServer = async () => {
  const connected = await testConnection();
  if (!connected) {
    console.warn('⚠️  Warning: Database connection failed, but service will start anyway');
    console.warn('⚠️  Please check your SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
  }

  app.listen(PORT, () => {
    console.log(`\n🏢 Départements Service running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Endpoints: /api/departements\n`);
  });
};

startServer();
