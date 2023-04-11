import express from 'express';

import { protect } from '../middleware/auth.middleware.js';

import { getWorkoutLogById } from './log/get-workout-log.controller.js';
import { updateWorkoutLogCompleteById } from './log/update-workout-log.controller.js';
import { createNewWorkoutLog } from './log/workout-log.controller.js';
import {
    createNewWorkout,
    deleteWorkoutById,
    getWorkoutById,
    getWorkouts,
    updateWorkoutById,
} from './workout.controller.js';

const router = express.Router();

router.route('/').post(protect, createNewWorkout).get(protect, getWorkouts);
router
    .route('/:id')
    .get(protect, getWorkoutById)
    .put(protect, updateWorkoutById)
    .delete(protect, deleteWorkoutById);

router.route('/log/:workoutId').post(protect, createNewWorkoutLog);
router.route('/log/:id').get(protect, getWorkoutLogById);
router.route('/log/complete/:id').patch(protect, updateWorkoutLogCompleteById);

export default router;
