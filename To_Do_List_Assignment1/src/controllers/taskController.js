const taskModel = require("../models/taskModel");
const { MESSAGE, STATUS_CODE } = require("../constants/statusConstant");

// ******************************************************************

const getAllTaskDetails = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const tasks = await taskModel.getTasks(userId);

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.SUCCESS_MESSAGE,
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
        message: MESSAGE.NOT_FOUND_MESSAGE,
      });
    }
    res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.SUCCESS_MESSAGE,
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

    const taskExists = await taskModel.checkIfTaskExists(title,USER_ID);

    if (taskExists) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        status: STATUS_CODE.BAD_REQUEST,
        message: MESSAGE.DUPLICATE_ERROR_MESSAGE,
      });
    }

    const task = await taskModel.createNewTask(
      { title, description, due_date },
      USER_ID,
      EMAIL
    );

    res.status(STATUS_CODE.CREATED).send({
      status: STATUS_CODE.CREATED,
      message: MESSAGE.CREATED_MESSAGE,
      data: task,
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

    const taskExists = await taskModel.checkIfTaskExists(title,userId);

    if (taskExists) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        status: STATUS_CODE.BAD_REQUEST,
        message: MESSAGE.DUPLICATE_ERROR_MESSAGE,
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
        STATUS_CODE: STATUS_CODE.NOT_FOUND,
        message: MESSAGE.NOT_FOUND_MESSAGE,
      });
    }

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.SUCCESS_MESSAGE,
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

const patchTask = async (req, res) => {
  try {
    const { status } = req.body;
    const { id: taskId } = req.params;
    const { id: userId } = req.user;

    const updateStatusResult = await taskModel.patchStatus(
      status,
      taskId,
      userId
    );

    if (updateStatusResult.affectedRows === 0) {
      res.status(STATUS_CODE.NOT_FOUND).send({
        status: STATUS_CODE.NOT_FOUND,
        message: MESSAGE.NOT_FOUND_MESSAGE,
      });
    }
    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.SUCCESS_MESSAGE,
      data: updateStatusResult,
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
        message: MESSAGE.NOT_FOUND_MESSAGE,
      });
    }
    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.SUCCESS_MESSAGE,
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
      message: MESSAGE.SUCCESS_MESSAGE,
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
        message: MESSAGE.NOT_FOUND_MESSAGE,
      });
    } else {
      return res.status(STATUS_CODE.SUCCESS).send({
        status: STATUS_CODE.SUCCESS,
        message: MESSAGE.SUCCESS_MESSAGE,
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
        message: MESSAGE.NOT_FOUND_MESSAGE,
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
      message: MESSAGE.SUCCESS_MESSAGE,
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
  patchTask,
  filterTasks,
};
