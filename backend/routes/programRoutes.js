import express from 'express';
import { upload } from '../middleware/upload.js';
import {
  importPrograms,
  exportPrograms,
  downloadTemplate,
  getAllPrograms,
  getProgramById
} from '../controllers/programController.js';

const router = express.Router();

router.post('/import', upload.single('file'), importPrograms);
router.get('/export', exportPrograms);
router.get('/template', downloadTemplate);
router.get('/', getAllPrograms);
router.get('/:id', getProgramById);

export default router;
