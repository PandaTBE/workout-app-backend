/**
 * Функция для получения длительности упражнений
 * @param {number} exerciseCount количество тренировок
 * @returns длительность в минутах
 */
export const calculateMinutes = (exerciseCount) => {
    const AVG_EXERCISE_DURATION = 3.7;
    return Math.ceil(exerciseCount) * AVG_EXERCISE_DURATION;
};
