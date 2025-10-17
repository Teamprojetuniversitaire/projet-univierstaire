import api from './api';

export const departementService = {
  getAll: () => api.get('/departements'),
  getById: (id) => api.get(`/departements/${id}`),
  create: (data) => api.post('/departements', data),
  update: (id, data) => api.put(`/departements/${id}`, data),
  delete: (id) => api.delete(`/departements/${id}`),
};

export const specialiteService = {
  getAll: () => api.get('/specialites'),
  getById: (id) => api.get(`/specialites/${id}`),
  create: (data) => api.post('/specialites', data),
  update: (id, data) => api.put(`/specialites/${id}`, data),
  delete: (id) => api.delete(`/specialites/${id}`),
};

export const matiereService = {
  getAll: () => api.get('/matieres'),
  getById: (id) => api.get(`/matieres/${id}`),
  create: (data) => api.post('/matieres', data),
  update: (id, data) => api.put(`/matieres/${id}`, data),
  delete: (id) => api.delete(`/matieres/${id}`),
};

export const groupeService = {
  getAll: () => api.get('/groupes'),
  getById: (id) => api.get(`/groupes/${id}`),
  create: (data) => api.post('/groupes', data),
  update: (id, data) => api.put(`/groupes/${id}`, data),
  delete: (id) => api.delete(`/groupes/${id}`),
};

export const salleService = {
  getAll: () => api.get('/salles'),
  getById: (id) => api.get(`/salles/${id}`),
  create: (data) => api.post('/salles', data),
  update: (id, data) => api.put(`/salles/${id}`, data),
  delete: (id) => api.delete(`/salles/${id}`),
};
