const STATUS_CODE = {
  CREATED: 201,
  SUCCESS: 200,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INVALID: 401,
  DUPLICATE: 409,
  FORBIDDEN: 403,
};

const MESSAGE = {
  SERVER_ERROR_MESSAGE: "Internal Server Error",
  INVALID_TOKEN_MESSAGE: "Invalid token.",
  INVALID_USER_MESSAGE: "Invalid User",
  LOGIN_SUCCESS_MESSAGE: "Login successfully",
  USER_UPDATE_SUCCESS_MSG: "User update successfully",
  FORBIDDEN_ERROR_MESSAGE: "Failed to authenticate token",
  UNAUTHORIZED_ACCESS_MESSAGE: "Unauthorized access",
  RETRIVEINFO_SUCCESS_MESSAGE: "Patient details are retrieved successfully",
  ADDED_PERSONALINFO_MESSAGE: "Personal information added successfully",
  NOT_UPDATE_MESSAGE: "Failed to update information",
  UPDATEINFO_SUCCESS_MESSAGE: "Update the information successfully",
  NOT_DELETE_MESSAGE: "Failed to delete information",
  DELETE_SUCCESS_MESSAGE: "Information deleted successfully",
  ADDED_FAMILY_MESSAGE: "Added family info successfully",
  GET_FAMILYINFO_MESSAGE: "Family information retrieved successfully",
  DISEASE_DETAILS: "Disease details retrieved succesfully",
  CREATED_DISEASEINFO_MESSAGE: "Disease info added successfully",
  NO_FILE: "No file uploaded",
  MISSING_REQUIRED: "Missing required fields",
  DOCUMENT_UPLOAD: "Document uploaded successfully",
  ALREADY_REGISTER: "User already exists",
  REGISTER_SUCCESS: "User registered successfully. Verification email sent.",
};

export { STATUS_CODE, MESSAGE };
