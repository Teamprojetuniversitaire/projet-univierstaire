import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import des routes des microservices
import departmentRoutes from './routes/departmentRoutes.js';
import roomTypeRoutes from './routes/roomTypeRoutes.js';
import programRoutes from './routes/programRoutes.js';
import levelRoutes from './routes/levelRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import etudiantRoutes from './routes/etudiantRoutes.js';
import enseignantRoutes from './routes/enseignantRoutes.js';

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration: allow a single origin, multiple origins (comma-separated), or reflect origin in development
const rawCors = process.env.CORS_ORIGIN || 'http://localhost:3000';
let corsOptions = { credentials: true };

// In development, reflect the request origin to avoid strict origin mismatch
if (process.env.NODE_ENV !== 'production') {
  corsOptions.origin = true; // reflect request origin
} else {
  if (rawCors === '*') {
    corsOptions.origin = true; // reflect request origin
  } else if (rawCors.includes(',')) {
    const allowed = rawCors.split(',').map(s => s.trim());
    corsOptions.origin = (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowed.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    };
  } else {
    corsOptions.origin = rawCors;
  }
}

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route de test
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Microservices - Système de Gestion Universitaire',
    version: '2.0.0',
    documentation: '/api-docs',
    microservices: {
      departments: '/api/departments',
      roomTypes: '/api/room-types',
      programs: '/api/programs',
      levels: '/api/levels',
      subjects: '/api/subjects',
      groups: '/api/groups',
      rooms: '/api/rooms',
      etudiants: '/api/etudiants',
      enseignants: '/api/enseignants'
    }
  });
});

// Routes des microservices
app.use('/api/departments', departmentRoutes);
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/etudiants', etudiantRoutes);
app.use('/api/enseignants', enseignantRoutes);

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════════╗
  ║  🚀 MICROSERVICES - Système de Gestion Universitaire     ║
  ║                                                            ║
  ║  📍 URL: http://localhost:${PORT}                           ║
  ║  📚 Documentation: http://localhost:${PORT}/api-docs       ║
  ║  🌍 Environnement: ${process.env.NODE_ENV || 'development'}                            ║
  ║                                                            ║
  ║  📦 Microservices disponibles:                            ║
  ║    • Départements     /api/departments                    ║
  ║    • Types de salles  /api/room-types                     ║
  ║    • Programmes       /api/programs                       ║
  ║    • Niveaux          /api/levels                         ║
  ║    • Matières         /api/subjects                       ║
  ║    • Groupes          /api/groups                         ║
  ║    • Salles           /api/rooms                          ║
  ║    • Étudiants        /api/etudiants                      ║
  ║    • Enseignants      /api/enseignants                    ║
  ║                                                            ║
  ║  🔄 Chaque microservice supporte:                         ║
  ║    • GET    /         → Liste complète                    ║
  ║    • GET    /:id      → Détail par ID                     ║
  ║    • POST   /import   → Import CSV                        ║
  ║    • GET    /export   → Export CSV                        ║
  ║    • GET    /template → Télécharger modèle CSV           ║
  ╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
