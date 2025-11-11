import express from 'express';
import { upload } from '../middleware/upload.js';
import {
  importGroups,
  exportGroups,
  downloadTemplate,
  getAllGroups,
  getGroupById
} from '../controllers/groupController.js';

const router = express.Router();

router.post('/import', upload.single('file'), importGroups);
router.get('/export', exportGroups);
router.get('/template', downloadTemplate);
router.get('/', getAllGroups);
router.get('/:id', getGroupById);

export default router;
