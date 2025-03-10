const taskModel = require("../models/taskModel");
const { MESSAGE, STATUS_CODE } = require("../constants/statusConstant");

// ******************************************************************

const getAllTaskDetails = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const tasks = await taskModel.getTasks(userId);

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.GET_TASK_MESSAGE,
      data: tasks,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.ERROR).send({
      status: STATUS_CODE.ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *****************************************************************

const getSpecificTaskDetails = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { id: userId } = req.user;

    const task = await taskModel.getSpecificTask(taskId, userId);
    if (task.length === 0) {
      return res.status(STATUS_CODE.NOT_FOUND).send({
        status: STATUS_CODE.NOT_FOUND,
        message: MESSAGE.TASKNOT_FOUND_MESSAGE,
      });
    }
    res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.GET_TASK_MESSAGE,
      data: task,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR,
    });
  }
};

// ***********************************************************


const createNewTask = async (req, res) => {
  try {
    const {
      body: { title, description, due_date },
    } = req;

    const { id: USER_ID, email: EMAIL } = req.user;

    const taskData = { title, due_date };
    if (description) {
      taskData.description = description;
    }

     await taskModel.createNewTask(taskData, USER_ID, EMAIL);

    res.status(STATUS_CODE.CREATED).send({
      status: STATUS_CODE.CREATED,
      message: MESSAGE.TASK_CREATED_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};


// **************************************************************

const updateTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id: taskId } = req.params;
    const { id: userId } = req.user;

    const taskStatus = await taskModel.getTaskStatusById(taskId, userId);

    if (taskStatus === 'complete') {
      return res.status(STATUS_CODE.FORBIDDEN).send({
        status: STATUS_CODE.FORBIDDEN,
        message: MESSAGE.TASK_ALREADY_COMPLETED,
      });
    }

    const updateTaskResult = await taskModel.updateTask(
      title,
      description,
      taskId,
      userId
    );

    if (updateTaskResult.affectedRows === 0) {
      return res.status(STATUS_CODE.NOT_FOUND).send({
        status: STATUS_CODE.NOT_FOUND,
        message: MESSAGE.TASK_NOT_UPDATED,
      });
    }

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.TASK_UPDATED_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR,
    });
  }
};


// ********************************************************************

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id: taskId } = req.params;
    const { id: userId } = req.user;

    const updateStatusResult = await taskModel.updateStatus(
      status,
      taskId,
      userId
    );

    if (updateStatusResult.affectedRows === 0) {
      res.status(STATUS_CODE.NOT_FOUND).send({
        status: STATUS_CODE.NOT_FOUND,
        message: MESSAGE.TASK_STATUSNOT_UPDATED_MESSAGE,
      });
    }
    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.UPDATE_STATUS_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR,
    });
  }
};

// ********************************************************************

const deleteTask = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: taskId } = req.params;

    const deleteTask = await taskModel.deleteTask(taskId, userId);

    if (deleteTask.affectedRows === 0) {
      res.status(STATUS_CODE.NOT_FOUND).send({
        status: STATUS_CODE.NOT_FOUND,
        message: MESSAGE.NOT_DELETE_MESSAGE,
      });
    }
    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.TASK_DELETE_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR,
    });
  }
};

// *****************************************************************************

const sortingTask = async (req, res) => {
  try {
    const { column, sortByOrder } = req.params;
    const { id: userId } = req.user;

    const validFields = ["TITLE", "CREATED_DATE", "DUE_DATE", "STATUS"];
    const sortField = validFields.includes(column.toUpperCase())
      ? column.toUpperCase()
      : "CREATED_DATE";
    const sortOrder = sortByOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const tasks = await taskModel.getSortedTasks(sortField, sortOrder, userId);

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.SORTED_TASK_MESSAGE,
      data: tasks,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR,
    });
  }
};

// *****************************************************************************

const searchTasks = async (req, res) => {
  try {
    const { column, keyword } = req.params;
    const { id: userId } = req.user;

    if (!column || !["title", "description"].includes(column)) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        status: STATUS_CODE.BAD_REQUEST,
        message: MESSAGE.INVALID_COLUMN_MESSAGE,
      });
    }
    if (!keyword) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        status: STATUS_CODE.BAD_REQUEST,
        message: MESSAGE.MISSING_KEYWORD_MESSAGE,
      });
    }
    const tasks = await taskModel.getSearchedTasks(userId, column, keyword);
    if (tasks.length === 0) {
      return res.status(STATUS_CODE.NOT_FOUND).send({
        status: STATUS_CODE.NOT_FOUND,
        message: MESSAGE.TASKNOT_FOUND_MESSAGE,
      });
    } else {
      return res.status(STATUS_CODE.SUCCESS).send({
        status: STATUS_CODE.SUCCESS,
        message: MESSAGE.TASK_SEARCHING_MESSAGE,
        data: tasks,
      });
    }
  } catch (error) {
    console.error(error.message);

    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR,
    });
  }
};

// *********************************************************************************

const filterTasks = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const { column, keyword, status, dueDate } = req.query;

    if (column && !["title", "description"].includes(column)) {
      return res.status(STATUS_CODE.NOT_FOUND).send({
        status: STATUS_CODE.NOT_FOUND,
        message: MESSAGE.INVALID_COLUMN_MESSAGE,
      });
    }

    const tasks = await taskModel.getFilteredTasks(
      column,
      keyword,
      status,
      dueDate,
      userId
    );
    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.FILTER_TASK_MESSAGE,
      data: tasks,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: MESSAGE.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || MESSAGE.UNEXPECTED_ERROR,
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
  updateStatus,
  filterTasks,
};

