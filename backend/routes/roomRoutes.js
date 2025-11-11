import express from 'express';
import { upload } from '../middleware/upload.js';
import {
  importRooms,
  exportRooms,
  downloadTemplate,
  getAllRooms,
  getRoomById
} from '../controllers/roomController.js';

const router = express.Router();

router.post('/import', upload.single('file'), importRooms);
router.get('/export', exportRooms);
router.get('/template', downloadTemplate);
router.get('/', getAllRooms);
router.get('/:id', getRoomById);

export default router;
