const Joi = require("joi");

const task_schemas = {
  createTaskSchema: Joi.object({
    title: Joi.string()
      .min(3)
      .max(255)
      .required()
      .error(new Error("title is required")),
    created_date: Joi.date()
      .optional()
      .error(new Error("created_date is in date format")),
    created_by: Joi.string()
      .email()
      .optional()
      .error(new Error("created_by is required")),
    updated_date: Joi.date()
      .optional()
      .error(new Error("updated_date is in date format")),
    updated_by: Joi.string()
      .email()
      .optional()
      .error(new Error("updated_by is in string format")),
    description: Joi.string()
      .optional()
      .error(new Error("description is in string format")),
    status: Joi.string()
      .optional()
      .error(new Error("status are only complete or incomplete")),
    due_date: Joi.date().required().error(new Error("due_date is required")),
  }),
  updateTaskSchema: Joi.object({
    title: Joi.string()
      .min(3)
      .max(255)
      .required()
      .error(
        new Error("title is in string format and min 3 letter are required")
      ),
    created_date: Joi.date().error(new Error("created_date is in date format")),
    created_by: Joi.string()
      .email()
      .error(new Error("created_by is in string format")),
    updated_date: Joi.date().error(new Error("updated_date is in date format")),
    updated_by: Joi.string()
      .email()
      .optional()
      .error(new Error("updated_by is in string format")),
    description: Joi.string()
      .required()
      .error(new Error("description is required")),
    status: Joi.string()
      .optional()
      .error(new Error("status are only complete or incomplete")),
    due_date: Joi.date()
      .optional()
      .error(new Error("due_date is in date format")),
  }),
  updateStatusSchema: Joi.object({
    status: Joi.string()
      .required()
      .valid("complete", "incomplete")
      .error(new Error("status are only complete or incomplete")),
  }),
};

const user_schemas = {
  createUserSchema: Joi.object({
    username: Joi.string()
      .number()
      .min(3)
      .required()
      .error(new Error("username is required")),
    password: Joi.string()
      .min(4)
      .required()
      .error(new Error("password is required and minimum length is 4")),
    name: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .error(new Error("name is required and minimum length is 3")),
    contact_no: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .error(
        new Error(
          "contact_no is required and only number are allowed, length is 10"
        )
      ),
    email: Joi.string()
      .email()
      .required()
      .error(new Error("email is required")),
  }),
  userLoginSchema: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .required()
      .error(new Error("username is required")),
    password: Joi.string()
      .min(4)
      .required()
      .error(new Error("password is required")),
  }),
  updateUserSchema: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .required()
      .error(
        new Error("username is alphanumeric and minimum length is 3 allowed")
      ),
    password: Joi.string()
      .min(4)
      .required()
      .error(new Error("minimum 4 length password is required")),
    name: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .error(new Error("minimum 3 character is required")),
    contact_no: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .error(
        new Error(
          "contact_no is required and only number are allowed, length is 10"
        )
      ),
    email: Joi.string()
      .email()
      .optional()
      .error(new Error("email is in proper format eg. abc123@gmail.com")),
  }),
};

module.exports = { task_schemas, user_schemas };
