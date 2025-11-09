import dbPool from "../config/dbConnection.js";

/**
 * TaskEntity handles all database interactions for task records.
 * It provides methods for retrieving and inserting task data.
 */
const TaskEntity = {
    /**
     * Fetch all tasks from the database in reverse chronological order.
     * @returns {Promise<Array>} A list of task objects.
     */
    async getAllTasks() {
        const queryText = `
      SELECT id, title, created_at
      FROM tasks
      ORDER BY created_at DESC;
    `;

        const { rows } = await dbPool.query(queryText);
        return rows;
    },

    /**
     * Insert a new task record into the database.
     * @param {Object} taskData - Contains the title of the task.
     * @returns {Promise<Object>} The inserted task row.
     */
    async addTask(taskData = {}) {
        const taskTitle = taskData.title?.trim();

        if (!taskTitle) {
            const err = new Error("Task title cannot be empty");
            err.status = 400;
            throw err;
        }

        const insertQuery = `
      INSERT INTO tasks (title)
      VALUES ($1)
      RETURNING id, title, created_at;
    `;

        const { rows } = await dbPool.query(insertQuery, [taskTitle]);
        return rows[0];
    },
};

export default TaskEntity;
