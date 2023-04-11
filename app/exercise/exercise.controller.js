import asyncHandler from 'express-async-handler';

import { prisma } from '../../server.js';

/**
 * @desc Создание упражнения
 * @route POST /api/exercises
 * @access Private
 */
export const createNewExercise = asyncHandler(async (req, res) => {
    const { name, times, iconPath } = req.body;

    const exercise = await prisma.exercise.create({
        data: { name, times, iconPath },
    });

    res.json(exercise);
});

/**
 * @desc Получение всех упражнений
 * @route GET /api/exercises
 * @access Private
 */
export const getExercises = asyncHandler(async (req, res) => {
    const exercises = await prisma.exercise.findMany({
        orderBy: { id: 'asc' },
        include: {
            exerciseLogs: true,
        },
    });
    res.json(exercises);
});

/**
 * @desc Обновление упражнения по id
 * @route PUT /api/exercises/:id
 * @access Private
 */
export const updateExerciseById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const exercise = await prisma.exercise.update({
            where: { id: Number(id) },
            data: req.body,
        });

        res.json(exercise);
    } catch (_) {
        res.status(404);
        throw new Error(`Упражнение с id ${id} не найдено`);
    }
});

/**
 * @desc Удаление упражнения по id
 * @route DELETE /api/exercises/:id
 * @access Private
 */
export const deleteExerciseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.exercise.delete({
            where: { id: Number(id) },
        });

        res.json({ message: 'Упражнение удалено!' });
    } catch (_) {
        res.status(404);
        throw new Error(`Упражнение с id ${id} не найдено`);
    }
});
