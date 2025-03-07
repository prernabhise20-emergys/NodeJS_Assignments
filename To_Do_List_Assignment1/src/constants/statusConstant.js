const STATUS_CODE = {
    CREATED: 201,
    SUCCESS: 200,
    SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INVALID: 401,
    DUPLICATE: 409,
    FORBIDDEN: 403
}

const MESSAGE = {
    CREATED_MESSAGE: "Created Successfully",
    SUCCESS_MESSAGE: "Action Perform Successfully",
    SERVER_ERROR_MESSAGE: "Internal Server Error",
    BAD_REQUEST_MESSAGE: "Fields are required",
    NOT_FOUND_MESSAGE: "Data not found",
    NO_TOKEN_MESSAGE: "Access denied. No token provided.",
    INVALID_TOKEN_MESSAGE: "Invalid token.",
    INVALID_USER_MESSAGE: "Invalid User",
    DUPLICATE_ERROR_MESSAGE: "Similar details already exists",
    INVALID_COLUMN_MESSAGE: "Invalid column name. Use 'title' or 'description",
    MISSING_KEYWORD_MESSAGE: "Keyword is required for searching",
    REGISTER_SUCCESS_MESSAGE: "User registered successfully",
    LOGIN_SUCCESS_MESSAGE: 'Login successfully',
    FAILED_CHECK_MESSAGE: "Failed to check task in data",
    FAILED_CREATE_MESSAGE: "Failed to create task",
    DB_ERROR_MESSAGE: "Database operation failed",
    TASK_NOTFOUND_MESSAGE: "Task not found",
    FAILURE_MESSAGE: "Failed to retrieve sorted tasks",
    UNEXPECTED_ERROR: "Unexpected Error",
    FORBIDDEN_ERROR_MESSAGE: "Failed to authenticate token"
    
}

module.exports={STATUS_CODE,MESSAGE}