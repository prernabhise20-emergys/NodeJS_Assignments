const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { taskPostMiddleware, taskPutMiddleware ,taskPatchMiddleware} = require('../middlewares/taskValidation');

router.get('/getTasks', taskController.getAllTaskDetails);
router.get('/getSpecificTask/:id',taskController.getSpecificTaskDetails)
router.post('/createTask', taskPostMiddleware, taskController.createNewTask);
router.put('/updateTask/:id', taskPutMiddleware, taskController.updateTask);
router.delete('/deleteTask/:id', taskController.deleteTask); 
router.get('/tasks/:column/:sortByOrder', taskController.sortingTask);
router.get('/taskssearch/:column/:keyword', taskController.searchTasks);
router.patch('/updateStatus/:id', taskPatchMiddleware, taskController.patchTask);
router.get('/filterTasks', taskController.filterTasks);

module.exports = router;
