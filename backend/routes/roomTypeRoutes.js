import express from 'express';
import { upload } from '../middleware/upload.js';
import {
  importRoomTypes,
  exportRoomTypes,
  downloadTemplate,
  getAllRoomTypes,
  getRoomTypeById
} from '../controllers/roomTypeController.js';

const router = express.Router();

router.post('/import', upload.single('file'), importRoomTypes);
router.get('/export', exportRoomTypes);
router.get('/template', downloadTemplate);
router.get('/', getAllRoomTypes);
router.get('/:id', getRoomTypeById);

export default router;
