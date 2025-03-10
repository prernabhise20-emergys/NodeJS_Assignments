const db = require("../db/connection");

// ********************************************************************

const getTasks = async (userId) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM tasks WHERE IS_DELETED = FALSE AND USER_ID = ? ORDER BY id DESC",
        userId,
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );
    });

    return data;
  } catch (error) {
    throw error;
  }
};

// ********************************************************************

const getSpecificTask = async (taskId, userId) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "SELECT *FROM TASKS WHERE IS_DELETED=FALSE AND ID=? and USER_ID=?",
        [taskId, userId],
        (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// ********************************************************************

const checkIfTaskExists = async (taskInfo,userId) => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM tasks WHERE title = ? and user_id=?",[taskInfo,userId],(error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });

    return result.length > 0;
  } catch (error) {
    throw error;
  }
};

// ***************************************************************************

const createNewTask = async (data, userId, email) => {
  try {
    data.user_id = userId;
    data.created_by = email;
    data.updated_by = email;

    return new Promise((resolve, reject) => {
      const query = "INSERT INTO TASKS SET ?";

      db.query(query, [data], (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  } catch (error) {
    throw error;
  }
};


// ******************************************************************

// const updateTask = async (title, description, taskId, userId) => {
//   try {
//     const data = await new Promise((resolve, reject) => {
//       db.query(
//         "UPDATE tasks SET TITLE = ? , DESCRIPTION = ? WHERE ID = ? and USER_ID=?",
//         [title, description, taskId, userId],
//         (error, result) => {
//           if (error) {
//             return reject(error);
//           }
//           resolve(result);
//         }
//       );
//     });

//     return data;
//   } catch (error) {
//     throw error;
//   }
// };
const getTaskStatusById = async (taskId, userId) => {
  try {
    return new Promise((resolve, reject) => {
      const query = "SELECT STATUS FROM TASKS WHERE ID = ? AND USER_ID = ?";
      
      db.query(query, [taskId, userId], (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result[0].STATUS);
      });
    });
  } catch (error) {
    throw error;
  }
};

const updateTask = async (title, description, taskId, userId) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE tasks SET TITLE = ? or DESCRIPTION = ? WHERE ID = ? and USER_ID=?",
        [title, description, taskId, userId],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
    });

    return data;
  } catch (error) {
    throw error;
  }
};



// **********************************************************************

const updateStatus = async (status, taskId, userId) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE tasks SET STATUS=? WHERE ID = ? and USER_ID=?",
        [status, taskId, userId],
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// ************************************************************

const deleteTask = async (taskId, userId) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE tasks SET IS_DELETED = TRUE WHERE id = ?",
        [taskId],
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result.affectedRows === 0) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });

    return data;
  } catch (error) {
    throw error;
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
            return reject(error);
          }
          resolve(results);
        }
      );
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// *******************************************************************************

const getSearchedTasks = async (userId, column, keyword) => {
  try {
    const data = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM tasks WHERE IS_DELETED=FALSE AND USER_ID=? AND ?? LIKE '%${keyword}%'`,
        [userId, column],
        (error, results) => {
          if (error) {
            return reject(error);
          }

          resolve(results);
        }
      );
    });
    return data;
  } catch (error) {
    throw error;
  }
};

// *****************************************************************************

const getFilteredTasks = (column, keyword, status, dueDate, userId) => {
  try {
    return new Promise((resolve, reject) => {
        
      let query = `SELECT *FROM tasks WHERE IS_DELETED=FALSE AND USER_ID=?`;

      if (column && keyword) {
        query += ` AND ${column} LIKE '%${keyword}%'`;
      }

      if (status) {       
        query += ` AND status = '${status}'`;
      }

      if (dueDate) {
        query += ` AND STATUS='INCOMPLETE' AND due_date < CURDATE()`;
      }

      db.query(query, [userId], (error, data) => {
        if (error) {
            console.log(error);
            
          return reject(error);
        }
        resolve(data);
      });
    });
  } catch (error) {
    throw error;
  }
};


// *****************************************************************************

module.exports = {
  getTasks,
  getSpecificTask,
  checkIfTaskExists,
  createNewTask,
  getTaskStatusById,
  updateTask,
  deleteTask,
  getSortedTasks,
  getSearchedTasks,
  updateStatus,
  getFilteredTasks,
};

