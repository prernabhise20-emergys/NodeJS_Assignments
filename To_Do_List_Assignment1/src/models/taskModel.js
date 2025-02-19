
const db = require('../db/connection');


// ********************************************************************

const getTasks = async () => {

    try {
        const data = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM tasks WHERE is_deleted =FALSE", (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            });
        });

        return data;
    } catch (error) {
        console.error("Error in fetching tasks", error);
        throw new Error(error.message);
    }
}

// ********************************************************************


const getSpecificTask = async (taskId) => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.query('SELECT *FROM TASKS WHERE ID=?', [taskId], (err, result) => {

                if (err) return reject(err);
                return resolve(result);
            })
        })
        return data;
    }
    catch (error) {
        console.error("Error in getSpecificTask:", error);
        throw error;
    }
}

// ********************************************************************

const checkIfTaskExists = async (taskInfo) => {
    try {
        const { title } = taskInfo;

        const result = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM tasks WHERE title = ?",
                [title], (error, results) => {
                    if (error) {
                        console.error("Database query error:", error);
                        return reject(new Error("Failed to check task in data"));
                    }
                    resolve(results);
                });
        });

        return result.length > 0;

    } catch (error) {
        console.error("Error in checkIfTaskExists:", error);
        throw new Error(error.message);
    }
};
// ***************************************************************************


const createNewTask = async (taskInfo) => {
    try {
        const taskDetail = taskInfo;

        const data = await new Promise((resolve, reject) => {
            const query = "INSERT INTO tasks SET ?";
            db.query(query, taskDetail, (error, result) => {
                if (error) {
                    console.error("Database query error:", error);
                    return reject(new Error("Failed to insert task into database"));
                }

                console.log("Task successfully created:", result);
                return resolve(result);
            });
        });

        return data;
    } catch (error) {
        console.error("Error in createNewTask:", error);
        throw new Error(error.message);
    }
};


// ******************************************************************
const updateTask = async ({ title, description, status, taskId }) => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.query(
                "UPDATE tasks SET TITLE = ?, DESCRIPTION = ?, STATUS = ? WHERE ID = ?",
                [title, description, status, taskId],
                (error, result) => {
                    if (error) {
                        console.error("Database query error", error);
                        return reject(new Error("Database operation failed"));
                    }
                    resolve(result);
                }
            );
        });

        return data;
    } catch (error) {
        console.error("Error in updateTask function", error);
        throw new Error(error.message);
    }
};

// **********************************************************************

const patchStatus = async ({ status, taskId }) => {
    try {
        const data = await new Promise((resolve, reject) => {

            db.query(
                "UPDATE tasks SET STATUS=? WHERE ID = ?",
                [status, taskId],
                (error, result) => {
                    if (error) {
                        console.error("Database query error", error);
                        return reject(new Error("Database operation failed"));
                    }

                    resolve(result);
                }
            );
        });
        return data;
    } catch (error) {
        console.error("Error in updateStatus function", error);
        throw new Error(error.message);
    }
};

// ************************************************************

const deleteTask = async (taskId) => {
    try {
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        const taskExists = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM tasks WHERE id = ?", [taskId], (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.length === 0) {
                    return reject(new Error("Task not found"));
                }
                return resolve(true);
            });
        });

        const data = await new Promise((resolve, reject) => {
            db.query("UPDATE tasks SET is_deleted = TRUE WHERE id = ?", 
                [taskId], 
                (error, result) => {
                    if (error) {
                        return reject(error); 
                    }
                    if (result.affectedRows === 0) {
                        return reject(new Error("Task not found or already deleted"));
                    }
                    return resolve(result); 
                });
        });

        return data;
    } catch (error) {
        console.error("Error in soft delete task:", error.message);
        throw new Error(error.message); 
    }
};


// *****************************************************************

const getSortedTasks = async (sortField, sortOrder) => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM tasks ORDER BY ?? ${sortOrder}`,
                [sortField],
                (error, results) => {
                    if (error) {
                        console.error("Database error", error);
                        return reject(new Error("Failed to retrieve sorted tasks"));
                    }
                    resolve(results);
                }
            );
        });
        return data;
    } catch (error) {
        console.error("Error in getSortedTasks", error);
        throw new Error(error.message);
    }
};

// *******************************************************************************

const getSearchedTasks = async (column, keyword) => {
    try {
        const searchQuery = `%${keyword}%`;
        const data = await new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM tasks WHERE ?? LIKE ?`,
                [column, searchQuery],
                (error, results) => {
                    if (error) {
                        console.error("Database error", error);
                        return reject(new Error("Failed to retrieve searched tasks"));
                    }

                    resolve(results);
                }
            );

        });
        return data;
    } catch (error) {
        console.error("Error in getSearchedTasks", error);
        throw new Error(error.message);
    }
};

// *****************************************************************************

const getFilteredTasks = ({ column, keyword, status, dueDate }) => {
    return new Promise((resolve, reject) => {
        try {
            let query;

            if (column && keyword) {
                query = `SELECT * FROM tasks WHERE 1=1 AND ${column} LIKE '%${keyword}%'`;
            }

            if (status) {
                query = `SELECT * FROM tasks WHERE 1=1 AND status = '${status}'`;
            }

            if (dueDate) {
                const compare = dueDate === 'overdue' ? '<' : '>';
                query = `SELECT * FROM tasks WHERE 1=1 AND STATUS='INCOMPLETE' AND due_date ${compare} NOW()`;
            }

            db.query(query, (error, data) => {
                if (error) {
                    console.error("Error in getFilteredTasks", error);
                    return reject(new Error("Failed to retrieve filtered tasks"));
                }
                resolve(data);
            });

        } catch (error) {
            console.error("Error in getFilteredTasks", error);
            reject(new Error("Failed to retrieve filtered tasks"));
        }
    });
};


// *****************************************************************************

module.exports = {
    getTasks,
    getSpecificTask,
    checkIfTaskExists,
    createNewTask,
    updateTask,
    deleteTask,
    getSortedTasks,
    getSearchedTasks,
    patchStatus,
    getFilteredTasks
};
