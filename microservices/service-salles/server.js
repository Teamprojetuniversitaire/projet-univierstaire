require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db');
const controller = require('./controller');

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Salles Service',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.get('/api/salles', controller.getAllSalles);
app.get('/api/salles/:id', controller.getSalleById);
app.post('/api/salles', controller.createSalle);
app.put('/api/salles/:id', controller.updateSalle);
app.delete('/api/salles/:id', controller.deleteSalle);

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
    console.log(`\n🚪 Salles Service running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Endpoints: /api/salles\n`);
  });
};

startServer();
