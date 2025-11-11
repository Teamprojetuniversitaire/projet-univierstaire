import express from 'express';
import { upload } from '../middleware/upload.js';
import {
  importEnseignants,
  exportEnseignants,
  downloadTemplate,
  getAllEnseignants
} from '../controllers/enseignantController.js';

const router = express.Router();

/**
 * @route   POST /api/enseignants/import
 * @desc    Importer des enseignants depuis un fichier CSV
 * @access  Public
 */
router.post('/import', upload.single('file'), importEnseignants);

/**
 * @route   GET /api/enseignants/export
 * @desc    Exporter tous les enseignants en CSV
 * @access  Public
 */
router.get('/export', exportEnseignants);

/**
 * @route   GET /api/enseignants/template
 * @desc    Télécharger un modèle CSV vide
 * @access  Public
 */
router.get('/template', downloadTemplate);

/**
 * @route   GET /api/enseignants
 * @desc    Récupérer tous les enseignants
 * @access  Public
 */
router.get('/', getAllEnseignants);

export default router;
