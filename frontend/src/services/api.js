import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuration axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Factory pour créer un service microservice générique
const createMicroserviceAPI = (endpoint) => ({
  // Importer des données via CSV
  import: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post(`/${endpoint}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },

  // Exporter des données en CSV
  export: async () => {
    return api.get(`/${endpoint}/export`, {
      responseType: 'blob',
    });
  },

  // Télécharger le template CSV
  downloadTemplate: async () => {
    return api.get(`/${endpoint}/template`, {
      responseType: 'blob',
    });
  },

  // Récupérer toutes les données
  getAll: async () => {
    return api.get(`/${endpoint}`);
  },

  // Récupérer une donnée par ID
  getById: async (id) => {
    return api.get(`/${endpoint}/${id}`);
  },
});

// Services pour les 7 microservices
export const departmentService = createMicroserviceAPI('departments');
export const roomTypeService = createMicroserviceAPI('room-types');
export const programService = createMicroserviceAPI('programs');
export const levelService = createMicroserviceAPI('levels');
export const subjectService = createMicroserviceAPI('subjects');
export const groupService = createMicroserviceAPI('groups');
export const roomService = createMicroserviceAPI('rooms');

// Services pour étudiants et enseignants
export const etudiantService = createMicroserviceAPI('etudiants');
export const enseignantService = createMicroserviceAPI('enseignants');

// Configuration des microservices
export const microservices = [
  {
    id: 'etudiants',
    name: 'Étudiants',
    icon: '🎓',
    service: etudiantService,
    description: 'Gérer les étudiants',
  },
  {
    id: 'enseignants',
    name: 'Enseignants',
    icon: '👨‍🏫',
    service: enseignantService,
    description: 'Gérer les enseignants',
  },
  {
    id: 'departments',
    name: 'Départements',
    icon: '🏢',
    service: departmentService,
    description: 'Gérer les départements',
  },
  {
    id: 'room-types',
    name: 'Types de salles',
    icon: '🏛️',
    service: roomTypeService,
    description: 'Gérer les types de salles',
  },
  {
    id: 'programs',
    name: 'Programmes',
    icon: '📚',
    service: programService,
    description: 'Gérer les programmes',
  },
  {
    id: 'levels',
    name: 'Niveaux',
    icon: '📊',
    service: levelService,
    description: 'Gérer les niveaux',
  },
  {
    id: 'subjects',
    name: 'Matières',
    icon: '📖',
    service: subjectService,
    description: 'Gérer les matières',
  },
  {
    id: 'groups',
    name: 'Groupes',
    icon: '👥',
    service: groupService,
    description: 'Gérer les groupes',
  },
  {
    id: 'rooms',
    name: 'Salles',
    icon: '🚪',
    service: roomService,
    description: 'Gérer les salles',
  },
];

export default api;
