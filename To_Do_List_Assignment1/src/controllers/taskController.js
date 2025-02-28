const TaskModel = require("../models/taskModel");
const { message, status } = require("../constants/statusConstant");

// ******************************************************************

const getAllTaskDetails = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const tasks = await TaskModel.getTasks(userId);

    return res.status(status.SUCCESS).send({
      status: status.SUCCESS,
      message: message.SUCCESS_MESSAGE,
      data: tasks,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(status.ERROR).send({
      status: status.ERROR,
      message: message.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || message.SERVER_ERROR_MESSAGE,
    });
  }
};

// *****************************************************************

const getSpecificTaskDetails = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { id: userId } = req.user;

    const task = await TaskModel.getSpecificTask(taskId, userId);
    if (task.length === 0) {
      return res.status(status.NOT_FOUND).send({
        status: status.NOT_FOUND,
        message: message.NOT_FOUND_MESSAGE,
      });
    }
    res.status(status.SUCCESS).send({
      status: status.SUCCESS,
      message: message.SUCCESS_MESSAGE,
      data: task,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(status.SERVER_ERROR).send({
      status: status.SERVER_ERROR,
      message: message.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || message.UNEXPECTED_ERROR,
    });
  }
};

// ***********************************************************

const createNewTask = async (req, res) => {
  try {
    const {body: { title, description, due_date }} = req;

    const { id: USER_ID, email: EMAIL } = req.user;

    const taskExists = await TaskModel.checkIfTaskExists(title);

    if (taskExists) {
      return res.status(status.BAD_REQUEST).send({
        status: status.BAD_REQUEST,
        message: message.BAD_REQUEST_MESSAGE,
      });
    }

    const task = await TaskModel.createNewTask({ title, description, due_date },USER_ID,EMAIL);

    res.status(status.CREATED).send({
      status: status.CREATED,
      message: message.CREATED_MESSAGE,
      data: task,
    });
    
  } catch (error) {
    console.error(error.message);
    return res.status(status.SERVER_ERROR).send({
      status: status.SERVER_ERROR,
      message: message.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || message.SERVER_ERROR_MESSAGE,
    });
  }
};

// **************************************************************

const updateTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id: taskId } = req.params;
    const { id: userId } = req.user;

    const taskExists = await TaskModel.checkIfTaskExists({ title });

    if (taskExists) {
      return res.status(status.BAD_REQUEST).send({
        status: status.BAD_REQUEST,
        message: message.DUPLICATE_ERROR_MESSAGE,
      });
    }

    const updateTaskResult = await TaskModel.updateTask(
      title,
      description,
      taskId,
      userId
    );

    if (updateTaskResult.affectedRows === 0) {
      return res.status(status.NOT_FOUND).send({
        STATUS_CODE: status.NOT_FOUND,
        message: message.NOT_FOUND_MESSAGE,
      });
    }

    return res.status(status.SUCCESS).send({
      status: status.SUCCESS,
      message: message.SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(status.SERVER_ERROR).send({
      status: status.SERVER_ERROR,
      message: message.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || message.UNEXPECTED_ERROR,
    });
  }
};

// ********************************************************************

const patchTask = async (req, res) => {
  try {
    const { status } = req.body;
    const { id: taskId } = req.params;
    const { id: userId } = req.user;

    const updateStatusResult = await TaskModel.patchStatus(
      status,
      taskId,
      userId
    );

    if (updateStatusResult.affectedRows === 0) {
      res.status(status.NOT_FOUND).send({
        status: status.NOT_FOUND,
        message: message.NOT_FOUND_MESSAGE,
      });
    }
    return res.status(status.SUCCESS).send({
      status: status.SUCCESS,
      message: message.SUCCESS_MESSAGE,
      data: updateStatusResult,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(status.SERVER_ERROR).send({
      status: status.SERVER_ERROR,
      message: message.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || message.UNEXPECTED_ERROR,
    });
  }
};

// ********************************************************************

const deleteTask = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: taskId } = req.params;

    const deleteTask = await TaskModel.deleteTask(taskId, userId);

    if (deleteTask.affectedRows === 0) {
      res.status(status.NOT_FOUND).send({
        status: status.NOT_FOUND,
        message: message.NOT_FOUND_MESSAGE,
      });
    }
    return res.status(status.SUCCESS).send({
      status: status.SUCCESS,
      message: message.SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(status.SERVER_ERROR).send({
      status: status.SERVER_ERROR,
      message: message.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || message.UNEXPECTED_ERROR,
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

    const tasks = await TaskModel.getSortedTasks(sortField, sortOrder, userId);

    return res.status(status.SUCCESS).send({
      status: status.SUCCESS,
      message: message.SUCCESS_MESSAGE,
      data: tasks,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(status.SERVER_ERROR).send({
      status: status.SERVER_ERROR,
      message: message.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || message.UNEXPECTED_ERROR,
    });
  }
};

// *****************************************************************************

const searchTasks = async (req, res) => {
  try {
    const { column, keyword } = req.params;
    const { id: userId } = req.user;

    if (!column || !["title", "description"].includes(column)) {
      return res.status(status.BAD_REQUEST).send({
        status: status.BAD_REQUEST,
        message: message.INVALID_COLUMN_MESSAGE,
      });
    }
    if (!keyword) {
      return res.status(status.BAD_REQUEST).send({
        status: status.BAD_REQUEST,
        message: message.MISSING_KEYWORD_MESSAGE,
      });
    }
    const tasks = await TaskModel.getSearchedTasks(userId, column, keyword);
    if (tasks.length === 0) {
      return res.status(status.NOT_FOUND).send({
        status: status.NOT_FOUND,
        message: message.NOT_FOUND_MESSAGE,
      });
    } else {
      return res.status(status.SUCCESS).send({
        status: status.SUCCESS,
        message: message.SUCCESS_MESSAGE,
        data: tasks,
      });
    }
  } catch (error) {
    console.error(error.message);

    return res.status(status.SERVER_ERROR).send({
      status: status.SERVER_ERROR,
      message: message.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || message.UNEXPECTED_ERROR,
    });
  }
};

// *********************************************************************************

const filterTasks = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const { column, keyword, status, dueDate } = req.query;

    if (column && !["title", "description"].includes(column)) {
      return res.status(status.NOT_FOUND).send({
        status: status.NOT_FOUND,
        message: message.NOT_FOUND_MESSAGE,
      });
    }
    const tasks = await TaskModel.getFilteredTasks(
      column,
      keyword,
      status,
      dueDate,
      userId
    );
    return res.status(status.SUCCESS).send({
      status: status.SUCCESS,
      message: message.SUCCESS_MESSAGE,
      data: tasks,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(status.SERVER_ERROR).send({
      status: status.SERVER_ERROR,
      message: message.SERVER_ERROR_MESSAGE,
      errorMessage: error.message || message.UNEXPECTED_ERROR,
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
