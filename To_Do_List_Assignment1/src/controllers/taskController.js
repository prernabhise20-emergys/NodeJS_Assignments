const TaskModel = require("../models/taskModel");
const constantDetails = require("../constants/statusConstant")

// ******************************************************************

const getAllTaskDetails = async (req, res) => {
    
    try {
        const userId = req.user.id;
        const tasks = await TaskModel.getTasks(userId);

        return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
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
        const userId = req.user.id;

        const task = await TaskModel.getSpecificTask(taskId,userId);
        if (task.length === 0) {
            return res.status(constantDetails.NOT_FOUND.STATUS_CODE).send({
                status: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }
        res.status(constantDetails.SUCCESS.STATUS_CODE).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            data: task
        });

    } catch (error) {
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// ***********************************************************
const createNewTask = async (req, res) => {
    try {
        const data = req.body;
        const { title } = data;  
        const USER_ID = req.user.id; 
        const email=req.user.email
                // console.log(req.user);
                
        const taskExists = await TaskModel.checkIfTaskExists( title );

        if (taskExists){
            return res.status(constantDetails.BAD_REQUEST.STATUS_CODE).send({
                status: constantDetails.BAD_REQUEST.STATUS_CODE,
                message:constantDetails.DUPLICATE.MESSAGE,
            });
        }
        
        const task = await TaskModel.createNewTask(data, USER_ID,email);

        res.status(constantDetails.CREATED.STATUS_CODE).send({
            status: constantDetails.CREATED.STATUS_CODE,
            message:constantDetails.CREATED.MESSAGE,
            data: task
        });
        
    } catch (error) {
        console.log(error);
        
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE,
        });
    }
};

// **************************************************************

const updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const taskId = req.params.id;
        const userId = req.user.id;

        const taskExists = await TaskModel.checkIfTaskExists({title});

        if (taskExists) {
            return res.status(constantDetails.BAD_REQUEST.STATUS_CODE).send({
                status: constantDetails.BAD_REQUEST.STATUS_CODE,
                message:constantDetails.DUPLICATE.MESSAGE,
            });
        }

        const updateTaskResult = await TaskModel.updateTask(title, description, status, taskId,userId );

        if (updateTaskResult.affectedRows === 0) {
            return res.status(constantDetails.NOT_FOUND.STATUS_CODE).send({
                STATUS_CODE: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }

        return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE
        });
    } catch (error) {
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
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
        const userId = req.user.id;

        const updateStatusResult = await TaskModel.patchStatus( status, taskId,userId );

        if (updateStatusResult.affectedRows === 0) {
            res.status(constantDetails.NOT_FOUND.STATUS_CODE).send({
                status: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }
        return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            data: updateStatusResult
        });
    } catch (error) {
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// ********************************************************************

const deleteTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;
        const deleteTask = await TaskModel.deleteTask(taskId,userId);

        if (deleteTask.affectedRows === 0) {
            res.status(constantDetails.NOT_FOUND.STATUS_CODE).send({
                status: constantDetails.NOT_FOUND.STATUS_CODE,
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }
        return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE
        });

    } catch (error) {
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};


// *****************************************************************************

const sortingTask = async (req, res) => {
    try {
        const { column, sortByOrder } = req.params;
        const userId = req.user.id;

        const validFields = ['TITLE', 'CREATED_DATE', 'DUE_DATE', 'STATUS'];
        const sortField = validFields.includes(column.toUpperCase()) ? column.toUpperCase() : 'CREATED_DATE';
        const sortOrder = sortByOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const tasks = await TaskModel.getSortedTasks(sortField, sortOrder,userId);
        return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            data: tasks

        })
    } catch (error) {
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// *****************************************************************************

const searchTasks = async (req, res) => {
    try {
        const { column, keyword } = req.params;
        const userId = req.user.id;

        if (!column || !['title', 'description'].includes(column)) {
            return res.status(constantDetails.BAD_REQUEST.STATUS_CODE).send({
                status: constantDetails.BAD_REQUEST.STATUS_CODE,
                message:constantDetails.INVALID_COLUMN.MESSAGE
            });
        }
        if (!keyword) {
            return res.status(constantDetails.BAD_REQUEST.STATUS_CODE).send({
                status: constantDetails.BAD_REQUEST.STATUS_CODE,
                message: constantDetails.MISSING.MESSAGE
            });
        }
        const tasks = await TaskModel.getSearchedTasks(userId,column,keyword);
        if (tasks.length === 0) {
            return res.status(constantDetails.NOT_FOUND.STATUS_CODE).send({
                message: constantDetails.NOT_FOUND.MESSAGE
            })
        }
        else {
            return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
                status: constantDetails.SUCCESS.STATUS_CODE,
                message: constantDetails.SUCCESS.MESSAGE,
                data: tasks
            })
        }
    } catch (error) {
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
            status: constantDetails.ERROR.STATUS_CODE,
            message: constantDetails.ERROR.MESSAGE
        });
    }
};

// *********************************************************************************

const filterTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(req.user);
        
        const { column, keyword, status, dueDate } = req.query;
        
        if (column && !['title', 'description'].includes(column)) {
            return res.status(constantDetails.NOT_FOUND.STATUS_CODE).send({
                status: constantDetails.NOT_FOUND.STATUS_CODE,
                message:constantDetails.INVALID_COLUMN.MESSAGE
            });
        }
        const tasks = await TaskModel.getFilteredTasks({ column, keyword, status, dueDate, userId });
        return res.status(constantDetails.SUCCESS.STATUS_CODE).send({
            status: constantDetails.SUCCESS.STATUS_CODE,
            message: constantDetails.SUCCESS.MESSAGE,
            data: tasks
        })
    } catch (error) {
        return res.status(constantDetails.ERROR.STATUS_CODE).send({
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
    deleteTask,
    getSpecificTaskDetails,
    sortingTask,
    searchTasks,
    patchTask,
    filterTasks
};
