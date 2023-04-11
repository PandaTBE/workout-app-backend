/**
 * Функция для получения предыдущих значения лога
 * @param {ExerciseLog} log текущий лог упражнения
 * @param {ExerciseLog} prevLog предыдущий лог упражнения
 * @returns лог упражнения с информацией из предыдущего лога
 */
export const addPrevValues = (log, prevLog = null) => {
    return log.times.map((element, index) => {
        return {
            ...element,
            prevWeight: prevLog?.times[index]?.weight || 0,
            prevRepeat: prevLog?.times[index]?.repeat || 0,
        };
    });
};
