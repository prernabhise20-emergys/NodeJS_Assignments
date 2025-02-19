const TaskModel = require("../models/taskModel");
const constantDetails = require("../constants/constant")

// ******************************************************************

const getAllTaskDetails = async (req, res) => {
    try {
        const tasks = await TaskModel.getTasks();
        return res.status(200).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            data: tasks
        });
    } catch (error) {
        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};



// *****************************************************************

const getSpecificTaskDetails = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await TaskModel.getSpecificTask(taskId);
        if (task.length === 0) {
            return res.status(404).send({
                status: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }
        res.status(200).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            data: task
        });

    } catch (error) {
        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// ***********************************************************

const createNewTask = async (req, res) => {
    try {
        const data = req.body;
        
        const title = req.body.title;

        const taskExists = await TaskModel.checkIfTaskExists({ title });

        if (taskExists) {
            return res.status(500).send({
                status: constantDetails.ERROR.STATUS_CODE,
                message: "Task with similar details already exists.",
            });
        }

        const task = await TaskModel.createNewTask(data);

        res.status(201).send({
            status: constantDetails.CREATED.STATUS_CODE,
            message: constantDetails.CREATED.MESSAGE,
            data: task
        });
    } catch (error) {
        console.error("Error in createNewTask:", error);

        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: error.message || constantDetails.ERROR.MESSAGE,
        });
    }
};

// **************************************************************

const updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const taskId = req.params.id;

        const taskExists = await TaskModel.checkIfTaskExists({title});

        if (taskExists) {
            return res.status(500).send({
                status: constantDetails.ERROR.STATUS_CODE,
                message: "Task with similar details already exists.",
            });
        }

        const updateTaskResult = await TaskModel.updateTask({ title, description, status, taskId });

        if (updateTaskResult.affectedRows === 0) {
            return res.status(404).send({
                STATUS_CODE: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }

        return res.status(200).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE
        });
    } catch (error) {
        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// ********************************************************************

const patchTask = async (req, res) => {
    try {
        const { status } = req.body;
        const taskId = req.params.id;

        const updateStatusResult = await TaskModel.patchStatus({ status, taskId });

        if (updateStatusResult.affectedRows === 0) {
            res.status(404).send({
                status: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }
        return res.status(200).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            data: updateStatusResult
        });
    } catch (error) {
        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// ********************************************************************

const deleteTask = async (req, res) => {


    try {
        const taskId = req.params.id;
        const deleteTask = await TaskModel.deleteTask(taskId);

        if (deleteTask.affectedRows === 0) {
            res.status(404).send({
                status: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }
        return res.status(200).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE
        });

    } catch (error) {
        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// *****************************************************************************

const restoreTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const restoreTask = await TaskModel.restoreTask(taskId);

        if (restoreTask.affectedRows === 0) {
            res.status(404).send({
                status: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            });
        }
        return res.status(200).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: "Task restored successfully"
        });

    } catch (error) {
        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// *****************************************************************************

const sortingTask = async (req, res) => {
    try {
        const { column, sortByOrder } = req.params;
        const validFields = ['TITLE', 'CREATED_DATE', 'DUE_DATE', 'STATUS'];
        const sortField = validFields.includes(column.toUpperCase()) ? column.toUpperCase() : 'CREATED_DATE';
        const sortOrder = sortByOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const tasks = await TaskModel.getSortedTasks(sortField, sortOrder);
        return res.status(200).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            data: tasks

        })
    } catch (error) {
        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// *****************************************************************************

const searchTasks = async (req, res) => {
    try {
        const { column, keyword } = req.params;
        if (!column || !['title', 'description'].includes(column)) {
            return res.status(400).send({
                status: constantDetails.BAD_REQUEST.STATUS_CODE,
                message: "Invalid column name. Use 'title' or 'description'"
            });
        }
        if (!keyword) {
            return res.status(400).send({
                status: constantDetails.BAD_REQUEST.STATUS_CODE,
                message: "Keyword is required for searching"
            });
        }
        const tasks = await TaskModel.getSearchedTasks(column, keyword);
        if (tasks.length === 0) {
            return res.status(404).send({
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }
        else {
            return res.status(200).send({
                status: constantDetails.SUCCESS.STATUS_CODE,
                message: constantDetails.SUCCESS.MESSAGE,
                data: tasks
            })
        }
    } catch (error) {
        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// *********************************************************************************

const filterTasks = async (req, res) => {
    try {
        const { column, keyword, status, dueDate } = req.query;
        if (column && !['title', 'description'].includes(column)) {
            return res.status(404).send({
                status: constantDetails.NOT_FOUND.STATUS_CODE,
                message: "Invalid column name, Use 'title' or 'description'"
            });
        }
        const tasks = await TaskModel.getFilteredTasks({ column, keyword, status, dueDate });
        return res.status(200).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            data: tasks
        })
    } catch (error) {
        return res.status(500).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// ***********************************************************************************

module.exports = {
    getAllTaskDetails,
    createNewTask,
    updateTask,
    restoreTask,
    deleteTask,
    getSpecificTaskDetails,
    sortingTask,
    searchTasks,
    patchTask,
    filterTasks
};
