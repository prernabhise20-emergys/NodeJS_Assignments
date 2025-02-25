const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const { bodyValidator } = require('../middlewares/taskValidation'); 
const to_do_schemas = require('../constants/schemaConstant'); 

const{userPostSchema,userLoginSchema,userPutMiddleware}=to_do_schemas;

router.post('/register', bodyValidator(userPostSchema), userController.register);
router.post('/login', bodyValidator(userLoginSchema), userController.login);
router.put('/updateUser/:id',  bodyValidator(userPutMiddleware), userController.updateUser);
router.get('/getAllUser', userController.getAllUser);
router.delete('/deleteUser/:id', userController.deleteUser);

module.exports = router;
