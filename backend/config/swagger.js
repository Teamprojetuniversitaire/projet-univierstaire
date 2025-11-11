import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Microservices - Système de Gestion Universitaire',
      version: '2.0.0',
      description: 'Architecture microservices pour la gestion complète du référentiel universitaire avec import/export CSV',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement'
      }
    ],
    tags: [
      {
        name: 'Départements',
        description: 'Gestion des départements académiques'
      },
      {
        name: 'Types de Salles',
        description: 'Gestion des types de salles (Amphithéâtre, TD, TP, etc.)'
      },
      {
        name: 'Programmes',
        description: 'Gestion des programmes et spécialités'
      },
      {
        name: 'Niveaux',
        description: 'Gestion des niveaux d\'études (L1, L2, L3, M1, M2)'
      },
      {
        name: 'Matières',
        description: 'Gestion des matières enseignées'
      },
      {
        name: 'Groupes',
        description: 'Gestion des groupes d\'étudiants'
      },
      {
        name: 'Salles',
        description: 'Gestion des salles de cours'
      }
    ]
  },
  apis: ['./controllers/*.js', './routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
