const Joi = require('joi');
const toLower=require('../utility/bodyConverter')
const schemas = {
    taskPostSchema: Joi.object({
        title: Joi.string().min(3).max(255).required(),
        created_date: Joi.date().optional(),
        created_by: Joi.string().email().required(),
        updated_date: Joi.date().optional(),
        updated_by: Joi.string().email().optional(),
        description: Joi.string().optional(),
        status: Joi.string().optional(),
        due_date: Joi.date().required()
    }),
    taskPutSchema: Joi.object({
        title: Joi.string().min(3).max(255).optional(),
        created_date: Joi.date(),
        created_by: Joi.string().email(),
        updated_date: Joi.date(),
        updated_by: Joi.string().email().optional(),
        description: Joi.string().optional(),
        status: Joi.string().optional(),
        due_date: Joi.date().optional()
    }),
    taskPatchSchema: Joi.object({
        title: Joi.string().min(3).max(255).optional(),
        created_date: Joi.date().optional(),
        created_by: Joi.string().email().optional(),
        updated_date: Joi.date().optional(),
        updated_by: Joi.string().email().optional(),
        description: Joi.string().optional(),
        status: Joi.string().optional(),
        due_date: Joi.date().optional()
    }),
    userPostSchema:Joi.object({
        username: Joi.string().alphanum().min(3).required(),
        password: Joi.string().min(4).required(),
        name:Joi.string().min(3).max(30).pattern(/^[a-zA-Z\s]+$/).required(),
        contact_no:Joi.string().pattern(/^[0-9]{10}$/).required()
    }),
    userLoginSchema:Joi.object({
        username: Joi.string().alphanum().min(3).required(),
        password: Joi.string().min(4).required()
    }),
    userPutMiddleware:Joi.object({
        username: Joi.string().alphanum().min(3).optional(),
        password: Joi.string().min(4).optional(),
        name:Joi.string().min(3).max(30).pattern(/^[a-zA-Z\s]+$/).optional(),
        contact_no:Joi.string().pattern(/^[0-9]{10}$/).optional()
    })
};

const bodyValidator = (schema) => {
    return (req, res, next) => {
        try {
            req.body = toLower(req.body);

            const { error } = schema.validate(req.body);
            if (error) {
                throw new Error(error.details[0].message);
            }

            next();
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    };
};

const taskPostMiddleware = bodyValidator(schemas.taskPostSchema);
const taskPutMiddleware = bodyValidator(schemas.taskPutSchema);
const taskPatchMiddleware = bodyValidator(schemas.taskPatchSchema);
const userPostMiddleware= bodyValidator(schemas.userPostSchema);
const userLoginMiddleware= bodyValidator(schemas.userLoginSchema);
const userPutMiddleware=bodyValidator(schemas.userPutMiddleware);

module.exports = {
    schemas,
    taskPostMiddleware,
    taskPutMiddleware,
    taskPatchMiddleware,
    userPostMiddleware,
    userLoginMiddleware,
    userPutMiddleware
};
