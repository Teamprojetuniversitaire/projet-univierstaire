import express from 'express';
import { upload } from '../middleware/upload.js';
import {
  importEtudiants,
  exportEtudiants,
  downloadTemplate,
  getAllEtudiants
} from '../controllers/etudiantController.js';

const router = express.Router();

/**
 * @route   POST /api/etudiants/import
 * @desc    Importer des étudiants depuis un fichier CSV
 * @access  Public
 */
router.post('/import', upload.single('file'), importEtudiants);

/**
 * @route   GET /api/etudiants/export
 * @desc    Exporter tous les étudiants en CSV
 * @access  Public
 */
router.get('/export', exportEtudiants);

/**
 * @route   GET /api/etudiants/template
 * @desc    Télécharger un modèle CSV vide
 * @access  Public
 */
router.get('/template', downloadTemplate);

/**
 * @route   GET /api/etudiants
 * @desc    Récupérer tous les étudiants
 * @access  Public
 */
router.get('/', getAllEtudiants);

export default router;
