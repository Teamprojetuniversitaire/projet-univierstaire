import express from 'express';
import { upload } from '../middleware/upload.js';
import {
  importLevels,
  exportLevels,
  downloadTemplate,
  getAllLevels,
  getLevelById
} from '../controllers/levelController.js';

const router = express.Router();

router.post('/import', upload.single('file'), importLevels);
router.get('/export', exportLevels);
router.get('/template', downloadTemplate);
router.get('/', getAllLevels);
router.get('/:id', getLevelById);

export default router;
