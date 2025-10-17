require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'API Gateway',
    timestamp: new Date().toISOString()
  });
});

// Service registry
const services = {
  departements: process.env.DEPARTEMENTS_SERVICE_URL || 'http://localhost:5001',
  specialites: process.env.SPECIALITES_SERVICE_URL || 'http://localhost:5002',
  matieres: process.env.MATIERES_SERVICE_URL || 'http://localhost:5003',
  groupes: process.env.GROUPES_SERVICE_URL || 'http://localhost:5004',
  salles: process.env.SALLES_SERVICE_URL || 'http://localhost:5005'
};

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Proxy options
const proxyOptions = (target) => ({
  target,
  changeOrigin: true,
  pathRewrite: {
    '^/api/departements': '/api/departements',
    '^/api/specialites': '/api/specialites',
    '^/api/matieres': '/api/matieres',
    '^/api/groupes': '/api/groupes',
    '^/api/salles': '/api/salles'
  },
  onError: (err, req, res) => {
    console.error(`[Proxy Error] ${err.message}`);
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'Le microservice est temporairement indisponible',
      service: target
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] Routing ${req.method} ${req.path} → ${target}`);
  }
});

// Route microservices
app.use('/api/departements', createProxyMiddleware(proxyOptions(services.departements)));
app.use('/api/specialites', createProxyMiddleware(proxyOptions(services.specialites)));
app.use('/api/matieres', createProxyMiddleware(proxyOptions(services.matieres)));
app.use('/api/groupes', createProxyMiddleware(proxyOptions(services.groupes)));
app.use('/api/salles', createProxyMiddleware(proxyOptions(services.salles)));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `La route ${req.originalUrl} n'existe pas`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[API Gateway Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 API Gateway running on port ${PORT}`);
  console.log(`\n📡 Service Registry:`);
  Object.entries(services).forEach(([name, url]) => {
    console.log(`   - ${name.padEnd(15)} → ${url}`);
  });
  console.log(`\n✨ Ready to route requests!\n`);
});
