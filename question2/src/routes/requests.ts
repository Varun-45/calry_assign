import { Router } from 'express';
import {
  getRequests,
  getRequestById,
  addRequest,
  updateRequest,
  deleteRequest,
  completeRequest,
 
} from '../controllers/requestController';

const router = Router();

router.get('/requests', getRequests);
router.get('/requests/:id', getRequestById);
router.post('/requests', addRequest);
router.put('/requests/:id', updateRequest);
router.delete('/requests/:id', deleteRequest);
router.post('/requests/:id/complete', completeRequest);

export default router;
