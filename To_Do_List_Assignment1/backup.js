// const TaskModel = require("../models/userModel");
// const constantDetails = require("../constants/constant")

// const getAllTaskDetails = async (req, res) => {
//     try {
//         const task = await TaskModel.getTasks();
//         res.send({
//             status: constantDetails.SUCCESS.CODE,
//             message: constantDetails.SUCCESS.MESSAGE,
//             data: task
//         });

//     } catch (error) {
//         console.log(error);
//         return res.send({
//             status: constantDetails.ERROR.CODE,
//             message: constantDetails.ERROR.MESSAGE
//         });
//     }
// };

// // *****************************************************************

// const getSpecificTaskDetails = async (req, res) => {
//     try {
//         const taskId = req.params.id;

//         if (!taskId) {
//             res.send('task id is required')
//         }
//         const task = await TaskModel.getSpecificTask(taskId);
//         if (task.length === 0) {
//             return res.send({
//                 status: constantDetails.NOT_FOUND.CODE,
//                 message: constantDetails.NOT_FOUND.MESSAGE
//             })
//         }
//         res.send({
//             status: constantDetails.SUCCESS.CODE,
//             message: constantDetails.SUCCESS.MESSAGE,
//             data: task
//         });

//     } catch (error) {
//         console.log(error);
//         return res.send({
//             status: constantDetails.ERROR.CODE,
//             message: constantDetails.ERROR.MESSAGE
//         });
//     }
// };

// // ***********************************************************

// const createNewTask = async (req, res) => {
//     try {
//         const data = req.body;
//         console.log("Received data:", data);
//         const task = await TaskModel.createNewTask(data);
//         res.send({
//             status: constantDetails.CREATED.CODE,
//             message: constantDetails.CREATED.MESSAGE,
//             data: task
//         });
//     } catch (error) {
//         console.error("Error in createNewTask:", error);
//         return res.send({
//             status: constantDetails.ERROR.CODE,
//             message: constantDetails.ERROR.MESSAGE
//         });
//     }
// };


// // **************************************************************
// const updateTask = async (req, resp) => {
//     try {
//         const { title, description, status } = req.body;
//         const taskId = req.params.id;

//         if (!title || !description || !status) {
//             return resp.send({
//                 status: constantDetails.BAD_REQUEST.CODE,
//                 message: constantDetails.BAD_REQUEST.MESSAGE
//             });
//         }

//         const updateTaskResult = await TaskModel.updateTask({ title, description, status, taskId });

//         if (!updateTaskResult) {
//             return resp.send({
//                 code: constantDetails.NOT_FOUND.CODE,
//                 message: constantDetails.NOT_FOUND.MESSAGE
//             });
//         }

//         if (updateTaskResult.affectedRows === 0) {
//             return resp.send({
//                 code: constantDetails.NOT_FOUND.CODE,
//                 message: constantDetails.NOT_FOUND.MESSAGE
//             })
//         }

//         return resp.send({
//             status: constantDetails.SUCCESS.CODE,
//             message: constantDetails.SUCCESS.MESSAGE
//         });
//     } catch (error) {
//         console.error("Error updating task", error);
//         return resp.send({
//             status: constantDetails.ERROR.CODE,
//             message: constantDetails.ERROR.MESSAGE
//         });
//     }
// };

// // ********************************************************************

// const patchTask = async (req, resp) => {
//     try {
//         const { status } = req.body;
//         const taskId = req.params.id;

//         if (!status) {
//             return resp.send({
//                 status: constantDetails.BAD_REQUEST.CODE,
//                 message: constantDetails.BAD_REQUEST.MESSAGE
//             });
//         }

//         const updateStatusResult = await TaskModel.patchStatus({ status, taskId });

//         if (updateStatusResult.affectedRows === 0) {
//             resp.send({
//                 status: constantDetails.NOT_FOUND.CODE,
//                 message: constantDetails.NOT_FOUND.MESSAGE
//             })
//         }
//         return resp.send({
//             status: constantDetails.SUCCESS.CODE,
//             message: constantDetails.SUCCESS.MESSAGE,
//             data: updateStatusResult
//         });
//     } catch (error) {
//         console.error("Error updating task", error);
//         return resp.send({
//             status: constantDetails.ERROR.CODE,
//             message: constantDetails.ERROR.MESSAGE
//         });
//     }
// };

// // ********************************************************************

// const deleteTask = async (req, resp) => {


//     try {
//         const taskId = req.params.id;
//         const deleteTask = await TaskModel.deleteTask(taskId);

//         if (deleteTask.affectedRows === 0) {
//             resp.send({
//                 status: constantDetails.NOT_FOUND.CODE,
//                 message: constantDetails.NOT_FOUND.MESSAGE
//             })
//         }
//         return resp.send({
//             status: constantDetails.SUCCESS.CODE,
//             message: constantDetails.SUCCESS.MESSAGE
//         });

//     } catch (error) {
//         console.error(error);
//         return resp.send({
//             status: constantDetails.ERROR.CODE,
//             message: constantDetails.ERROR.MESSAGE
//         });
//     }
// };

// // *****************************************************************************

// const sortingTask = async (req, res) => {
//     try {
//         const { column, sortByOrder } = req.params;
//         const validFields = ['TITLE', 'CREATED_DATE', 'DUE_DATE', 'STATUS'];
//         const sortField = validFields.includes(column.toUpperCase()) ? column.toUpperCase() : 'CREATED_DATE';
//         const sortOrder = sortByOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

//         const tasks = await TaskModel.getSortedTasks(sortField, sortOrder);
//         return res.send({
//             status: constantDetails.SUCCESS.CODE,
//             message: constantDetails.SUCCESS.MESSAGE,
//             data: tasks

//         })
//     } catch (error) {
//         console.error("Error in sortingTask", error);
//         return res.send({
//             status: constantDetails.ERROR.CODE,
//             message: constantDetails.ERROR.MESSAGE
//         });
//     }
// };

// // *****************************************************************************

// const searchTasks = async (req, res) => {
//     try {
//         const { column, keyword } = req.params;
//         if (!column || !['title', 'description'].includes(column)) {
//             return res.send({
//                 status: constantDetails.BAD_REQUEST.CODE,
//                 message: "Invalid column name. Use 'title' or 'description'"
//             });
//         }
//         if (!keyword) {
//             return res.send({
//                 status: constantDetails.BAD_REQUEST.CODE,
//                 message: "Keyword is required for searching"
//             });
//         }
//         const tasks = await TaskModel.getSearchedTasks(column, keyword);
//         if (tasks.length === 0) {
//             return res.send({
//                 message: constantDetails.NOT_FOUND.MESSAGE
//             })
//         }
//         else {
//             return res.send({
//                 status: constantDetails.SUCCESS.CODE,
//                 message: constantDetails.SUCCESS.MESSAGE,
//                 data: tasks
//             })
//         }
//     } catch (error) {
//         console.error("Error in searchTasks", error);
//         return res.send({
//             status: constantDetails.ERROR.CODE,
//             message: constantDetails.ERROR.MESSAGE
//         });
//     }
// };

// // *********************************************************************************


// const filterTasks = async (req, res) => {
//     try {
//         const { column, keyword, status, dueDate } = req.query;
//         if (column && !['title', 'description'].includes(column)) {
//             return res.send({
//                 status: constantDetails.NOT_FOUND.CODE,
//                 message: "Invalid column name, Use 'title' or 'description'"
//             });
//         }
//         const tasks = await TaskModel.getFilteredTasks({ column, keyword, status, dueDate });
//         return res.send({
//             status: constantDetails.SUCCESS.CODE,
//             message: constantDetails.SUCCESS.MESSAGE,
//             data: tasks
//         })
//     } catch (error) {
//         console.error("Error in filterTasks", error);
//         return res.send({
//             status: constantDetails.ERROR.CODE,
//             message: constantDetails.ERROR.MESSAGE
//         });
//     }
// };

// // ***********************************************************************************
// module.exports = {
//     getAllTaskDetails,
//     createNewTask,
//     updateTask,
//     deleteTask,
//     getSpecificTaskDetails,
//     sortingTask,
//     searchTasks,
//     patchTask,
//     filterTasks
// };




// const db = require('../db/connection');


// // ********************************************************************

// const getTasks = async () => {
//     const data = await new Promise((resolve, reject) => {
//         db.query('SELECT *FROM TASKS', (err, result) => {
//             if (err) return reject(err);
//             return resolve(result);
//         })
//     })
//     return data

// }

// // ********************************************************************


// const getSpecificTask = async (taskId) => {
//     console.log(taskId);
//     const data = await new Promise((resolve, reject) => {
//         db.query('SELECT *FROM TASKS WHERE ID=?', [taskId], (err, result) => {

//             if (err) return reject(err);
//             return resolve(result);
//         })
//     })
//     return data;
// }

// // ********************************************************************

// const createNewTask = async (taskInfo) => {
//     const taskDetail = taskInfo;
//     try {
//         const data = await new Promise((resolve, reject) => {
//             db.query("INSERT INTO tasks SET ?", taskDetail, (error, result) => {
//                 if (error) {
//                     console.error("Database query error:", error);
//                     return reject(error);
//                 }
//                 return resolve(result);
//             });
//         });
//         return data;
//     } catch (error) {
//         console.error("Error in createNewTask:", error);
//         throw error;
//     }
// };


// // ******************************************************************
// const updateTask = async ({ title, description, status, taskId }) => {
//     try {
//         const data = await new Promise((resolve, reject) => {
//             db.query(
//                 "UPDATE tasks SET TITLE = ?, DESCRIPTION = ?, STATUS = ? WHERE ID = ?",
//                 [title, description, status, taskId],
//                 (error, result) => {
//                     if (error) {
//                         console.error("Database query error", error);
//                         return reject(new Error("Database operation failed"));
//                     }
//                     resolve(result);
//                 }
//             );
//         });
//         console.log(data);
        
//         return data;
//     } catch (error) {
//         console.error("Error in updateTask function", error);
//         throw new Error(error.message);
//     }
// };

// // **********************************************************************

// const patchStatus = async ({ status, taskId }) => {
//     try {
//         const data = await new Promise((resolve, reject) => {

//             db.query(
//                 "UPDATE tasks SET STATUS=? WHERE ID = ?",
//                 [status, taskId],
//                 (error, result) => {
//                     if (error) {
//                         console.error("Database query error", error);
//                         return reject(new Error("Database operation failed"));
//                     }
                   
//                     resolve(result);
//                 }
//             );
//         });
//         return data;
//     } catch (error) {
//         console.error("Error in updateTask function", error);
//         throw new Error(error.message);
//     }
// };

// // ************************************************************

// const deleteTask = async (taskId) => {

//     const data = await new Promise((resolve, reject) => {
//         db.query("DELETE FROM tasks WHERE id = ?", [taskId], (error, result) => {
//             if (error) return reject(error);
//             return resolve(result);
//         })
//     })
    
//     return data;
// }

// // *****************************************************************

// const getSortedTasks = async (sortField, sortOrder) => {
//     try {
//         const data = await new Promise((resolve, reject) => {
//             db.query(
//                 `SELECT * FROM tasks ORDER BY ?? ${sortOrder}`,
//                 [sortField],
//                 (error, results) => {
//                     if (error) {
//                         console.error("Database error", error);
//                         return reject(new Error("Failed to retrieve sorted tasks"));
//                     }
//                     resolve(results);
//                 }
//             );
//         });
//         return data;
//     } catch (error) {
//         console.error("Error in getSortedTasks", error);
//         throw new Error(error.message);
//     }
// };

// // *******************************************************************************

// const getSearchedTasks = async (column, keyword) => {
//     try {
//         const searchQuery = `%${keyword}%`;
//         const data = await new Promise((resolve, reject) => {
//             db.query(
//                 `SELECT * FROM tasks WHERE ?? LIKE ?`,
//                 [column, searchQuery],
//                 (error, results) => {
//                     if (error) {
//                         console.error("Database error", error);
//                         return reject(new Error("Failed to retrieve searched tasks"));
//                     }

//                     resolve(results);
//                 }
//             );

//         });
// console.log(data)
//         return data;
//     } catch (error) {
//         console.error("Error in getSearchedTasks", error);
//         throw new Error(error.message);
//     }
// };

// // *****************************************************************************



// const getFilteredTasks = async ({ column, keyword, status, dueDate }) => {
//     try {
//         let query = 'SELECT * FROM tasks WHERE 1=1';
//         const values = [];
//         if (column && keyword) {
//             query += ' AND ?? LIKE ?';
//             values.push(column, `%${keyword}%`);
//         }
//         if (status) {

//                 query += ' AND status = ?';
//                 values.push(status);
//         }
//         if (dueDate) {
//             const compare = dueDate === 'overdue' ? '<' : '>';
//             query += ` AND STATUS='INCOMPLETE' AND due_date ${compare} NOW()`;
//          } 
//         const data = await new Promise((resolve, reject) => {
//             db.query(query, values, (error, results) => {
//                 if (error) {
//                     console.error("Database error", error);
//                     return reject(new Error("Failed to retrieve filtered tasks"));
//                 } resolve(results);
//             });
//         });
//         return data;
//     }
//     catch (error) {
//         console.error("Error in getFilteredTasks", error);
//         throw new Error(error.message);
//     }
// };

// // *****************************************************************************

// module.exports = {
//     getTasks,
//     getSpecificTask,
//     createNewTask,
//     updateTask,
//     deleteTask,
//     getSortedTasks,
//     getSearchedTasks,
//     patchStatus,
//     getFilteredTasks
// };
