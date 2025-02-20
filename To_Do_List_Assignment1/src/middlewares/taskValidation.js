const Joi = require('joi');

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
        updated_by: Joi.string().email().required(),
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
    })
};

const convertTOLower = (obj) => {
    const convertingObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            convertingObj[key.toLowerCase()] = obj[key];
        }
    }
    return convertingObj;
};

const taskMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            req.body = convertTOLower(req.body);

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

const taskPostMiddleware = taskMiddleware(schemas.taskPostSchema);
const taskPutMiddleware = taskMiddleware(schemas.taskPutSchema);
const taskPatchMiddleware = taskMiddleware(schemas.taskPatchSchema);

module.exports = {
    schemas,
    taskPostMiddleware,
    taskPutMiddleware,
    taskPatchMiddleware
};
