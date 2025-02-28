const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { bodyValidator} = require('../middlewares/taskValidation');
const authenticateUser = require('../middlewares/authMiddleware');
const {task_schemas} = require('../constants/schemaConstant'); 
const {updateStatusSchema,createTaskSchema,updateTaskSchema} = task_schemas;//TASK SCHEMAS

router.get('/getTasks/', authenticateUser, taskController.getAllTaskDetails);
router.get('/getSpecificTask/:id', authenticateUser, taskController.getSpecificTaskDetails);
router.post('/createTask', authenticateUser, bodyValidator(createTaskSchema), taskController.createNewTask);
router.put('/updateTask/:id', authenticateUser, bodyValidator(updateTaskSchema), taskController.updateTask);
router.delete('/deleteTask/:id', authenticateUser, taskController.deleteTask);
router.get('/tasks/:column/:sortByOrder', authenticateUser, taskController.sortingTask);
router.get('/taskssearch/:column/:keyword', authenticateUser, taskController.searchTasks);
router.patch('/updateStatus/:id', authenticateUser, bodyValidator(updateStatusSchema), taskController.patchTask);//CHANGE NAME
router.get('/filterTasks', authenticateUser, taskController.filterTasks);

module.exports = router;
