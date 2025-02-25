module.exports = {
    CREATED: {
        STATUS_CODE: 201,
        MESSAGE: "Created Successfully"
    },
    SUCCESS: {
        STATUS_CODE: 200,
        MESSAGE: "Action Perform Successfully"
    },
    ERROR: {
        STATUS_CODE: 500,
        MESSAGE: "Internal Server Error"
    },
    BAD_REQUEST: {
        STATUS_CODE: 400,
        MESSAGE: "Fields are required"
    },
    NOT_FOUND: {
        STATUS_CODE: 404,
        MESSAGE: "Data not found"
    },
    NO_TOKEN: {
        MESSAGE: "Access denied. No token provided."
    },
    INVALID: {
        MESSAGE: "Invalid token."
    },
    INVALID_USER: {
        STATUS_CODE: 401,
        MESSAGE: "Invalid User"
    },
    DUPLICATE: {
        MESSAGE: "Similar details already exists"
    },
    INVALID_COLUMN: {
        MESSAGE: "Invalid column name. Use 'title' or 'description"
    },
    MISSING: {
        MESSAGE: "Keyword is required for searching"
    },
    REGISTER: {
        MESSAGE: 'User registered successfully'
    },
    LOGIN: {
        MESSAGE: 'Login successful'
    },
    FAILED_CHECK:{
        MESSAGE:"Failed to check task in data"
    },
    FAILED_CREATE:{
        MESSAGE:"Failed to create task"
    },
    DB_ERROR:{
        MESSAGE:"Database operation failed"
    },
    TASK_NOTFOUND:{
        MESSAGE:"Task not found"
    },
    FAILURE:{
        MESSAGE:"Failed to retrieve sorted tasks"
    }

}