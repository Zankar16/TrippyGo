import express from 'express';
import { 
  getTrips, 
  getTripById, 
  createTrip, 
  updateTrip, 
  deleteTrip,
  addActivity,
  updateActivity,
  deleteActivity
} from '../controllers/tripController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getTrips);
router.post('/', verifyToken, createTrip);
router.get('/:id', verifyToken, getTripById);
router.put('/:id', verifyToken, updateTrip);
router.delete('/:id', verifyToken, deleteTrip);

// Nested Activities logic (Step 4 Fixes)
router.post('/:tripId/days/:dayId/activities', verifyToken, addActivity);
router.put('/:tripId/activities/:activityId', verifyToken, updateActivity);
router.delete('/:tripId/activities/:activityId', verifyToken, deleteActivity);

export default router;
