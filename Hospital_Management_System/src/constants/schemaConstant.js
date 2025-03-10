import Joi from 'joi';

const user_schemas = {

   createUserSchema: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .error(new Error("email is required and must be a valid email")),

    user_password: Joi.string()
      .min(4)
      .required()
      .error(new Error("user_password is required and must be at least 6 characters")),

    first_name: Joi.string()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .error(new Error("first_name is required and must have a minimum length of 3")),

    last_name: Joi.string()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .error(new Error("last_name is required and must have a minimum length of 3")),

    mobile_number: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .error(new Error("mobile_number is required and must be 10 digits")),
   }),

   userLoginSchema: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .error(new Error("email is required and must be a valid email")),

    user_password: Joi.string()
      .min(4)
      .required()
      .error(new Error("user_password is required and must be at least 6 characters")),
   }),

   updateUserSchema: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .error(new Error("email is required and must be a valid email")),

    user_password: Joi.string()
      .min(4)
      .required()
      .error(new Error("user_password is required and must be at least 6 characters")),

    first_name: Joi.string()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .error(new Error("first_name is required and must have a minimum length of 3")),

    last_name: Joi.string()
      .min(3)
      .max(100)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .error(new Error("last_name is required and must have a minimum length of 3")),

    mobile_number: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .error(new Error("mobile_number is required and must be 10 digits")),
   }),

   createPersonalInfo: Joi.object({
    date_of_birth: Joi.date()
      .required()
      .error(new Error("date_of_birth is required and must be a valid date")),

    weight: Joi.number()
      .positive()
      .optional()
      .error(new Error("weight must be a positive number")),

    height: Joi.string()
      .pattern(/^\d+(\.\d{1,2})?$/)
      .optional()
      .error(new Error("height must be a valid number, e.g., 5.2")),

    country_of_origin: Joi.string()
      .optional()
      .error(new Error("country_of_origin is required")),

    is_diabetic: Joi.boolean()
      .optional()
      .error(new Error("is_diabetic must be a boolean")),

    cardiac_issue: Joi.boolean()
      .optional()
      .error(new Error("cardiac_issue must be a boolean")),

    blood_pressure: Joi.boolean()
      .optional()
      .error(new Error("blood_pressure must be a boolean")),
   }),

   updatePersonalInfo: Joi.object({
    date_of_birth: Joi.date()
      .required()
      .error(new Error("date_of_birth is required and must be a valid date")),

    weight: Joi.number()
      .positive()
      .optional()
      .error(new Error("weight must be a positive number")),

    height: Joi.string()
      .pattern(/^\d+(\.\d{1,2})?$/)
      .optional()
      .error(new Error("height must be a valid number, e.g., 5.2")),

    country_of_origin: Joi.string()
      .optional()
      .error(new Error("country_of_origin is required")),

    is_diabetic: Joi.boolean()
      .optional()
      .error(new Error("is_diabetic must be a boolean")),

    cardiac_issue: Joi.boolean()
      .optional()
      .error(new Error("cardiac_issue must be a boolean")),

    blood_pressure: Joi.boolean()
      .optional()
      .error(new Error("blood_pressure must be a boolean")),
   }),

  createFamilyInfo: Joi.object({
    father_name: Joi.string().min(3).max(100).required(),
    father_age: Joi.number().min(18).required(),
    father_country_origin: Joi.string().min(3).max(25).required(),
    mother_name: Joi.string().min(3).max(100).required(),
    mother_age: Joi.number().min(18).required(),
    mother_country_origin: Joi.string().min(3).max(25).required(),
    parent_diabetic: Joi.boolean().required(),
    parent_cardiac_issue: Joi.boolean().required(),
    parent_bp: Joi.boolean().required(),
  }),

  updateFamilyInfo: Joi.object({
    father_name: Joi.string().min(3).max(100),
    father_age: Joi.number().min(18),
    father_country_origin: Joi.string().min(3).max(25),
    mother_name: Joi.string().min(3).max(100),
    mother_age: Joi.number().min(18),
    mother_country_origin: Joi.string().min(3).max(25),
    parent_diabetic: Joi.boolean(),
    parent_cardiac_issue: Joi.boolean(),
    parent_bp: Joi.boolean(),
  }),

  createDiseaseInfo: Joi.object({
    disease_type:Joi.string().required(),
    disease_description:Joi.string().max(255).required(),
  }),

  updateDiseaseInfo: Joi.object({
    disease_type:Joi.string().optional(),
    disease_description:Joi.string().max(255).optional(),
  }),
};

export { user_schemas };
