const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { taskPostMiddleware, taskPutMiddleware ,taskPatchMiddleware} = require('../middlewares/taskValidation');
const userController=require('../controllers/userController');
const authenticateUser = require('../middlewares/authMiddleware');
const {userPostMiddleware,userLoginMiddleware,userPutMiddleware}=require('../middlewares/taskValidation')


router.get('/getTasks',authenticateUser, taskController.getAllTaskDetails); 
router.get('/getSpecificTask/:id',authenticateUser, taskController.getSpecificTaskDetails); 
router.post('/createTask',authenticateUser, taskPostMiddleware, taskController.createNewTask); 
router.put('/updateTask/:id',authenticateUser, taskPutMiddleware, taskController.updateTask);
router.delete('/deleteTask/:id',authenticateUser, taskController.deleteTask); 
router.get('/tasks/:column/:sortByOrder',authenticateUser, taskController.sortingTask); 
router.get('/taskssearch/:column/:keyword',authenticateUser, taskController.searchTasks); 
router.patch('/updateStatus/:id',authenticateUser, taskPatchMiddleware, taskController.patchTask); 
router.get('/filterTasks',authenticateUser, taskController.filterTasks); 

router.post('/register',userPostMiddleware,userController.register);
router.post('/login',userLoginMiddleware,userController.login)
router.put('/updateUser/:id',userPutMiddleware, userController.updateUser);
router.get('/getAllUser',userController.getAllUser)
router.delete('/deleteUser/:id',userController.deleteUser)

module.exports = router;
