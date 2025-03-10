const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const authenticateUser = require('../middlewares/authMiddleware');
const { bodyValidator } = require('../middlewares/taskValidation'); 
const {user_schemas} = require('../constants/schemaConstant'); 

const{createUserSchema,userLoginSchema,updateUserSchema}=user_schemas;

router.post('/register', bodyValidator(createUserSchema), userController.register);
router.post('/login', bodyValidator(userLoginSchema), userController.login);
router.put('/updateUser',authenticateUser,bodyValidator(updateUserSchema), userController.updateUser);
router.get('/getUser',authenticateUser, userController.getUser);
router.delete('/deleteUser', authenticateUser,userController.deleteUser);

module.exports = router;
