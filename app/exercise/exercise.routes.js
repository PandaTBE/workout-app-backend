import express from 'express';

import { protect } from '../middleware/auth.middleware.js';

import {
    createNewExercise,
    deleteExerciseById,
    getExercises,
    updateExerciseById,
} from './exercise.controller.js';
import { createNewExerciseLog } from './log/exercise-log.controller.js';
import { getExerciseLogById } from './log/get-exercise-log.controller.js';
import {
    updateExerciseLogCompleteById,
    updateExerciseLogTimeById,
} from './log/update-exercise-log.controller.js';

const router = express.Router();

router.route('/').post(protect, createNewExercise).get(protect, getExercises);
router
    .route('/:id')
    .put(protect, updateExerciseById)
    .delete(protect, deleteExerciseById);

router.route('/log/:exerciseId').post(protect, createNewExerciseLog);

router.route('/log/:id').get(protect, getExerciseLogById);

router.route('/log/time/:id').patch(protect, updateExerciseLogTimeById);
router.route('/log/complete/:id').patch(protect, updateExerciseLogCompleteById);

export default router;
