import express from 'express';
import { upload } from '../middleware/upload.js';
import {
  importDepartments,
  exportDepartments,
  downloadTemplate,
  getAllDepartments,
  getDepartmentById
} from '../controllers/departmentController.js';

const router = express.Router();

router.post('/import', upload.single('file'), importDepartments);
router.get('/export', exportDepartments);
router.get('/template', downloadTemplate);
router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);

export default router;
