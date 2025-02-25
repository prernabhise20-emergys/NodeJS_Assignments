const db = require('../db/connection');
const constantDetails = require('../constants/statusConstant')

// ********************************************************************

const getTasks = async (userId) => {


    try {
        const data = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM tasks WHERE IS_DELETED = FALSE AND USER_ID=?", userId, (error, result) => {
                if (error) return reject(error);
                return resolve(result);
            });
        });

        return data;
    } catch (error) {
        throw new Error(constantDetails.ERROR.STATUS_CODE);
    }
}

// ********************************************************************

const getSpecificTask = async (taskId, userId) => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.query('SELECT *FROM TASKS WHERE IS_DELETED=FALSE AND ID=? and USER_ID=?', [taskId, userId], (err, result) => {

                if (err) return reject(err);
                return resolve(result);
            })
        })
        return data;
    }
    catch (error) {
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
                        return reject(new Error(constantDetails.FAILED_CHECK.MESSAGE));
                    }
                    resolve(results);
                });
        });

        return result.length > 0;

    } catch (error) {
        console.log('message: ', error);
        throw new Error(error.message);
    }
};

// ***************************************************************************

const createNewTask = async (data, userId,email) => {
    try {

        data["USER_ID"] = userId;
        data["CREATED_BY"]=email;

        return new Promise((resolve, reject) => {
            const query = "INSERT INTO TASKS SET ?";

            db.query(query, [data], (error, result) => {
                if (error) {
                    return reject(new Error(constantDetails.FAILED_CREATE.MESSAGE));
                }
                return resolve(result);
            });
        });
    }
    catch (error) {
        throw new Error(error);
    }
};

// ******************************************************************
const updateTask = async (title, description, status, taskId, userId) => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.query(
                "UPDATE tasks SET TITLE = ?, DESCRIPTION = ?, STATUS = ? WHERE ID = ? and USER_ID=?",
                [title, description, status, taskId, userId],
                (error, result) => {
                    if (error) {
                        return reject(new Error(constantDetails.DB_ERROR.MESSAGE));
                    }
                    resolve(result);
                }
            );
        });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// **********************************************************************

const patchStatus = async (status, taskId, userId) => {
    try {
        const data = await new Promise((resolve, reject) => {

            db.query(
                "UPDATE tasks SET STATUS=? WHERE ID = ? and USER_ID=?",
                [status, taskId, userId],
                (error, result) => {
                    if (error) {
                        return reject(new Error(constantDetails.DB_ERROR.MESSAGE));
                    }

                    resolve(result);
                }
            );
        });
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// ************************************************************

const deleteTask = async (taskId, userId) => {
    try {


        const taskExists = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM tasks WHERE id = ? and USER_ID=?", [taskId, userId], (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (result.length === 0) {
                    return reject(new Error(constantDetails.TASK_NOTFOUND.MESSAGE));
                }
                return resolve(true);
            });
        });

        const data = await new Promise((resolve, reject) => {
            db.query("UPDATE tasks SET IS_DELETED = TRUE WHERE id = ?",
                [taskId],
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    if (result.affectedRows === 0) {
                        return reject(new Error(constantDetails.TASK_NOTFOUND.MESSAGE));
                    }
                    return resolve(result);
                });
        });

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};


// *****************************************************************

const getSortedTasks = async (sortField, sortOrder, userId) => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM tasks WHERE IS_DELETED=FALSE AND USER_ID=? ORDER BY ?? ${sortOrder}`,
                [userId, sortField],
                (error, results) => {
                    if (error) {
                        return reject(new Error(constantDetails.FAILURE.MESSAGE));
                    }
                    resolve(results);
                }
            );
        });
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// *******************************************************************************

const getSearchedTasks = async (userId, column, keyword) => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM tasks WHERE USER_ID=? AND ?? LIKE '%${keyword}%'`,
                [userId, column],
                (error, results) => {
                    if (error) {
                        return reject(new Error("Failed to retrieve searched tasks"));
                    }

                    resolve(results);
                }
            );

        });
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// *****************************************************************************

const getFilteredTasks = ({ column, keyword, status, dueDate, userId }) => {
    return new Promise((resolve, reject) => {
        try {
            let query;

            if (column && keyword) {
                query = `SELECT * FROM tasks WHERE 1=1 AND USER_ID=? AND ${column} LIKE '%${keyword}%'`;
            }

            if (status) {
                query = `SELECT * FROM tasks WHERE 1=1 AND USER_ID=? AND status = '${status}'`;
            }

            if (dueDate) {
                const compare = dueDate === 'overdue' ? '<' : '>';
                query = `SELECT * FROM tasks WHERE 1=1 AND USER_ID=? AND STATUS='INCOMPLETE' AND due_date ${compare} NOW()`;
            }

            db.query(query, [userId], (error, data) => {
                if (error) {
                    console.error("Error in getFilteredTasks", error);
                    return reject(new Error("Failed to retrieve filtered tasks"));
                }
                resolve(data);
                return data;
            });


        } catch (error) {
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
