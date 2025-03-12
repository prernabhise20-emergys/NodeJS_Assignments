const ERROR_STATUS_CODE = {
    SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INVALID: 401,
    DUPLICATE: 409,
    FORBIDDEN: 403
}
const SUCCESS_STATUS_CODE={
    CREATED: 201,
    SUCCESS: 200,
}

const SUCCESS_MESSAGE = {
    REGISTER_MESSAGE: "User register successfully",
    GET_USER_MESSAGE:"User details are display successfully",
    DELETE_USER_MESSAGE:"User is deleted",
    SUCCESS_MESSAGE: "Action Perform Successfully",
    GET_TASK_MESSAGE:"Your task is retrieved successfully",
    USER_UPDATE_MESSAGE:"User details is updated successfully",
    TASK_CREATED_MESSAGE:"Task created successfully",
    TASK_UPDATED_MESSAGE:"Task updated successfully",
    UPDATE_STATUS_MESSAGE:"Task status is updated successfully",
    TASK_DELETE_MESSAGE:"Task is deleted successfully",
    SORTED_TASK_MESSAGE:"Task is sorted successfully",
    FILTER_TASK_MESSAGE:"Task is filtered successfully",
    TASK_ALREADY_COMPLETED:"Task already completed",
    TASK_SEARCHING_MESSAGE:"Task searching successfully",
    LOGIN_SUCCESS_MESSAGE: 'Login successfully',

}

const ERROR_MESSAGE={
    TASKNOT_FOUND_MESSAGE:"Task is not found",
    SERVER_ERROR_MESSAGE: "Internal Server Error",
    TASKNOT_UPDATED_MESSAGE:"Task is not updated",
    TASK_STATUSNOT_UPDATED_MESSAGE:"Task status is not updated",
    NOT_DELETE_MESSAGE:"Task is not deleted",
    BAD_REQUEST_MESSAGE: "Fields are required",
    NO_TOKEN_MESSAGE: "Access denied. No token provided.",
    INVALID_TOKEN_MESSAGE: "Invalid token.",
    TASKNOT_FOUND_MESSAGE:"Task not found",
 INVALID_USER_MESSAGE: "Invalid username try again",
    DUPLICATE_USER_MESSAGE:"User is already register try with another email",
    DUPLICATE_ERROR_MESSAGE: "Similar details already exists",
    INVALID_COLUMN_MESSAGE: "Invalid column name. Use 'title' or 'description",
    MISSING_KEYWORD_MESSAGE: "Keyword is required for searching",
    REGISTER_SUCCESS_MESSAGE: "User registered successfully",
    FAILED_CHECK_MESSAGE: "Failed to check task in data",
    FAILED_CREATE_MESSAGE: "Failed to create task",
    DB_ERROR_MESSAGE: "Database operation failed",
    TASK_NOTFOUND_MESSAGE: "Task not found",
    FAILURE_MESSAGE: "Failed to retrieve sorted tasks",
    UNEXPECTED_ERROR: "Unexpected Error",
    FORBIDDEN_ERROR_MESSAGE: "Failed to authenticate token",
    TASK_NOT_UPDATED:"Task is not updated",
    TASK_ALREADY_COMPLETED:"Task is already completed"

}

module.exports={ERROR_STATUS_CODE ,SUCCESS_STATUS_CODE,SUCCESS_MESSAGE,ERROR_MESSAGE}