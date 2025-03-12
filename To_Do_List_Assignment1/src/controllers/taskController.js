const taskModel = require("../models/taskModel");
const { ERROR_STATUS_CODE ,SUCCESS_STATUS_CODE,SUCCESS_MESSAGE,ERROR_MESSAGE } = require("../constants/statusConstant");

// ******************************************************************

const getAllTaskDetails = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const tasks = await taskModel.getTasks(userId);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.GET_TASK_MESSAGE,
      data: tasks,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(ERROR_STATUS_CODE.SERVER_ERROR).send({
      status:ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message ||MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *****************************************************************

const getSpecificTaskDetails = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { id: userId } = req.user;

    const task = await taskModel.getSpecificTask(taskId, userId);
    if (!task.length) {
      throw{
        status: ERROR_STATUS_CODE.NOT_FOUND,
        message: ERROR_MESSAGE.TASKNOT_FOUND_MESSAGE,
      };
    }
    res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.GET_TASK_MESSAGE,
      data: task,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status|| ERROR_STATUS_CODE.SERVER_ERROR).send({
      status:error.status|| ERROR_STATUS_CODE.SERVER_ERROR,
    });
  }
};

// ***********************************************************

const createNewTask = async (req, res) => {
  try {
    const {
      body: { title, description = null, due_date },
    } = req;

    const { id: USER_ID, email: EMAIL } = req.user;

    const taskData = { title, description, due_date };
    const taskExists = await taskModel.checkIfTaskExists(title, due_date, USER_ID);

    if (taskExists) {
      throw{
        status: ERROR_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.DUPLICATE_ERROR_MESSAGE,
      };
    }

    await taskModel.createNewTask(taskData, USER_ID, EMAIL);

    res.status(SUCCESS_STATUS_CODE.CREATED).send({
      status: SUCCESS_STATUS_CODE.CREATED,
      message: SUCCESS_MESSAGE.TASK_CREATED_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status|| ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status|| ERROR_STATUS_CODE.SERVER_ERROR,
      message:error.message ||  ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};



// **************************************************************

// const updateTask = async (req, res) => {
//   try {
//     const { title, description,due_date } = req.body;
//     const { id: taskId } = req.params;
//     const { id: userId } = req.user;

//     const taskExists = await taskModel.checkIfTaskExists(title, due_date, userId);

//     if (taskExists) {
//       throw{
//         status: ERROR_STATUS_CODE.BAD_REQUEST,
//         message: ERROR_MESSAGE.DUPLICATE_ERROR_MESSAGE,
//       };
//     }
  
//     const taskStatus = await taskModel.getTaskStatusById(taskId, userId);

//     if (taskStatus === 'complete') {
//       throw{
//         status: ERROR_STATUS_CODE.FORBIDDEN,
//         message: ERROR_MESSAGE.TASK_ALREADY_COMPLETED,
//       };
//     }

//     const data={title,
//       description,
//       due_date,}
//     const updateTaskResult = await taskModel.updateTask(
//       data,
//       taskId,
//       userId
//     );

//     if (updateTaskResult) {
//       throw{
//         status: ERROR_STATUS_CODE.NOT_FOUND,
//         message: ERROR_MESSAGE.TASK_NOT_UPDATED,
//       };
//     }

//     return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
//       status: SUCCESS_STATUS_CODE.SUCCESS,
//       message: SUCCESS_MESSAGE.TASK_UPDATED_MESSAGE,
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(error.status||ERROR_STATUS_CODE.SERVER_ERROR).send({
//       status: error.status||ERROR_STATUS_CODE.SERVER_ERROR,
//       message:error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
//     });
//   }
// };
const updateTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    const { id: taskId } = req.params;
    const { id: userId } = req.user;

  //   if(description===null){
  //   const taskExists = await taskModel.checkIfTaskExists(title, due_date, userId);

  //   if (taskExists) {
  //     throw {
  //       status: ERROR_STATUS_CODE.BAD_REQUEST,
  //       message: ERROR_MESSAGE.DUPLICATE_ERROR_MESSAGE,
  //     };
  //   }
  // }
    const taskStatus = await taskModel.getTaskStatusById(taskId, userId);

    if (taskStatus === 'complete') {
      throw {
        status: ERROR_STATUS_CODE.FORBIDDEN,
        message: ERROR_MESSAGE.TASK_ALREADY_COMPLETED,
      };
    }
    const dataset = {};

    if (title) dataset.title = title; 
    if (description) dataset.description = description; 
    if (due_date) dataset.due_date = due_date;

    if (Object.keys(dataset).length === 0) {
      throw {
        status: ERROR_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.NO_DATA_TO_UPDATE,
      };
    }

    const updateTaskResult = await taskModel.updateTask(dataset, taskId, userId);

    if (!updateTaskResult) {
      throw {
        status: ERROR_STATUS_CODE.NOT_FOUND,
        message: ERROR_MESSAGE.TASK_NOT_UPDATED,
      };
    }

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.TASK_UPDATED_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(error.status || ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status || ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
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

    if (updateStatusResult) {
      throw{
        status: ERROR_STATUS_CODE.NOT_FOUND,
        message: ERROR_MESSAGE.TASK_STATUSNOT_UPDATED_MESSAGE,
      };
    }
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.UPDATE_STATUS_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(error.status||ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status||ERROR_STATUS_CODE.SERVER_ERROR,
      message: error.message || ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// ********************************************************************

const deleteTask = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id: taskId } = req.params;

    const deleteTask = await taskModel.deleteTask(taskId, userId);

    if (deleteTask) {
      throw{
        status: ERROR_STATUS_CODE.NOT_FOUND,
        message: ERROR_MESSAGE.NOT_DELETE_MESSAGE,
      };
    }
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.TASK_DELETE_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(error.status||ERROR_STATUS_CODE.SERVER_ERROR).send({
      status:error.status|| ERROR_STATUS_CODE.SERVER_ERROR,
      message:error.message|| ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *****************************************************************************

const sortingTask = async (req, res) => {
  try {
    const { column="created_date", sortByOrder='desc' } = req.params;
    const { id: userId } = req.user;
  
    const tasks = await taskModel.getSortedTasks(column, sortByOrder, userId);

    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.SORTED_TASK_MESSAGE,
      data: tasks,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: error.status||ERROR_STATUS_CODE.SERVER_ERROR,
      message:error.message ||  ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *****************************************************************************

const searchTasks = async (req, res) => {
  try {
    const {keyword } = req.params;
    const { id: userId } = req.user;

    if (!keyword) {
      throw{
        status: ERROR_STATUS_CODE.BAD_REQUEST,
        message: ERROR_MESSAGE.MISSING_KEYWORD_MESSAGE,
      };
    }
    const tasks = await taskModel.getSearchedTasks(userId, keyword);
    if (!tasks.length) {
      throw{
        status: ERROR_STATUS_CODE.NOT_FOUND,
        message: ERROR_MESSAGE.TASKNOT_FOUND_MESSAGE,
      };
    } else {
      return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
        status: SUCCESS_STATUS_CODE.SUCCESS,
        message: SUCCESS_MESSAGE.TASK_SEARCHING_MESSAGE,
        data: tasks,
      });
    }
  } catch (error) {
    console.error(error.message);

    return res.status(ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: ERROR_STATUS_CODE.SERVER_ERROR,
      message: ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// *********************************************************************************

const filterTasks = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const {status, due_date } = req.query;

    const tasks = await taskModel.getFilteredTasks(
      status,
      due_date,
      userId
    );
    return res.status(SUCCESS_STATUS_CODE.SUCCESS).send({
      status: SUCCESS_STATUS_CODE.SUCCESS,
      message: SUCCESS_MESSAGE.FILTER_TASK_MESSAGE,
      data: tasks,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(ERROR_STATUS_CODE.SERVER_ERROR).send({
      status: ERROR_STATUS_CODE.SERVER_ERROR,
      message: ERROR_MESSAGE.SERVER_ERROR_MESSAGE,
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

