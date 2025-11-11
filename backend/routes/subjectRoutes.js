import express from 'express';
import { upload } from '../middleware/upload.js';
import {
  importSubjects,
  exportSubjects,
  downloadTemplate,
  getAllSubjects,
  getSubjectById
} from '../controllers/subjectController.js';

const router = express.Router();

router.post('/import', upload.single('file'), importSubjects);
router.get('/export', exportSubjects);
router.get('/template', downloadTemplate);
router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);

export default router;
