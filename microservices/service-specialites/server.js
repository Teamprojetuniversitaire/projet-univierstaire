require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db');
const controller = require('./controller');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Spécialités Service',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.get('/api/specialites', controller.getAllSpecialites);
app.get('/api/specialites/:id', controller.getSpecialiteById);
app.post('/api/specialites', controller.createSpecialite);
app.put('/api/specialites/:id', controller.updateSpecialite);
app.delete('/api/specialites/:id', controller.deleteSpecialite);

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
    console.log(`\n📚 Spécialités Service running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Endpoints: /api/specialites\n`);
  });
};

startServer();
