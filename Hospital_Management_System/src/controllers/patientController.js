import { MESSAGE, STATUS_CODE } from "../constants/statusConstant.js";
import { uploadFile } from '../services/upload.js';

import {
  personalDetails,
  updatePersonalDetails,
  getInfo,
  deletePersonalDetails,
  addDiseaseData,
  insertFamilyInfo,
  getFamilyInfo,
  updateFamilyInfo,
  deleteFamilyInfo,
  updateDiseaseDetails,
  deleteDiseaseDetails,
  getDiseaseInfo,
  saveDocument,
  checkPersonalInfo,
  checkFamilyInfo,
  checkDiseaseInfo
} from "../models/patientModel.js";

const getAllInfo = async (req, res) => {
  try {
    const { admin: is_admin } = req.user;
    const { uid: id } = req.user;

    if (!is_admin) {
      return res.status(STATUS_CODE.INVALID).send({
        status: STATUS_CODE.INVALID,
        message: MESSAGE.UNAUTHORIZED_ACCESS_MESSAGE,
      });
    }

    let { page = 1 } = req.query;
    page = parseInt(page, 10);
    const limit = 10;
    const offset = (page - 1) * limit;

    const personalInfo = await getInfo(id, is_admin, limit, offset);

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.RETRIVEINFO_SUCCESS_MESSAGE,
      data: personalInfo,
      pagination: {
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.ERROR).send({
      status: STATUS_CODE.ERROR,
      message:error.message|| MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};


const personalInfo = async (req, res) => {
  try {
    const {
      body: {
        date_of_birth,
        weight,
        height,
        country_of_origin,
        is_diabetic,
        cardiac_issue,
        blood_pressure,
      },
    } = req;

    const { uid: id, email: email } = req.user;
    const data = {
      date_of_birth,
      weight,
      height,
      country_of_origin,
      is_diabetic,
      cardiac_issue,
      blood_pressure,
    };

    const users = await personalDetails(data, id, email);

    res.status(STATUS_CODE.CREATED).send({
      status: STATUS_CODE.CREATED,
      message: MESSAGE.ADDED_PERSONALINFO_MESSAGE,
      data: users,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message||MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const updatePersonalInfo = async (req, res) => {
  try {
    const {
      body: {
        date_of_birth,
        weight,
        height,
        country_of_origin,
        is_diabetic,
        cardiac_issue,
        blood_pressure,
      },
    } = req;
    const { uid: id } = req.user;
    const data = {
      date_of_birth,
      weight,
      height,
      country_of_origin,
      is_diabetic,
      cardiac_issue,
      blood_pressure,
    };

    const updateInfo = await updatePersonalDetails(data, id);

    if (updateInfo.affectedRows === 0) {
      return res.status(STATUS_CODE.NOT_FOUND).send({
        STATUS_CODE: STATUS_CODE.NOT_FOUND,
        message: MESSAGE.NOT_UPDATE_MESSAGE,
      });
    }

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.UPDATEINFO_SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message||MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const deletePersonalInfo = async (req, res) => {
  try {
    const { uid: id } = req.user;

    const deleteTask = await deletePersonalDetails(id);

    if (deleteTask.affectedRows === 0) {
      res.status(STATUS_CODE.NOT_FOUND).send({
        status: STATUS_CODE.NOT_FOUND,
        message: MESSAGE.NOT_DELETE_MESSAGE,
      });
    }
    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.DELETE_SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);

    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message ||MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};


// *************************************************************************

const addFamilyInfo = async (req, res) => {
  try {
    const {
      body: {
        father_name,
        father_age,
        father_country_origin,
        mother_name,
        mother_age,
        mother_country_origin,
        parent_diabetic,
        parent_cardiac_issue,
        parent_bp,
      },
    } = req;
    const { uid: id, email } = req.user;

    console.log(id);

    const personalExists = await checkPersonalInfo(id);
    if (!personalExists) {
      return res.send({message: 'Please fill personal info first.' });
    }
  
    const familyData = {
      father_name,
      father_age,
      father_country_origin,
      mother_name,
      mother_age,
      mother_country_origin,
      parent_diabetic,
      parent_cardiac_issue,
      parent_bp,
    };

    const result = await insertFamilyInfo(familyData, id, email);
    return res.status(STATUS_CODE.CREATED).send({
      status: STATUS_CODE.CREATED,
      message: MESSAGE.ADDED_FAMILY_MESSAGE,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message ||MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const getFamilyDetails = async (req, res) => {
  try {
    const { uid: id } = req.user;
    const familyInfo = await getFamilyInfo(id);

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.GET_FAMILYINFO_MESSAGE,
      data: familyInfo,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.ERROR).send({
      status: STATUS_CODE.ERROR,
      message: error.message ||MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const updateFamilyInfoDetails = async (req, res) => {
  try {
    const {
      body: {
        father_name,
        father_age,
        father_country_origin,
        mother_name,
        mother_age,
        mother_country_origin,
        parent_diabetic,
        parent_cardiac_issue,
        parent_bp,
      },
    } = req;
    const { uid: id } = req.user;

    const familyData = {
      father_name,
      father_age,
      father_country_origin,
      mother_name,
      mother_age,
      mother_country_origin,
      parent_diabetic,
      parent_cardiac_issue,
      parent_bp,
    };

    const result = await updateFamilyInfo(familyData, id);

    if (result.affectedRows === 0) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        status: STATUS_CODE.BAD_REQUEST,
        message: MESSAGE.NOT_UPDATE_MESSAGE,
      });
    }

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.UPDATEINFO_SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const deleteFamilyInfoDetails = async (req, res) => {
  try {
    const { uid: id } = req.user;

    const result = await deleteFamilyInfo(id);

    if (result.affectedRows === 0) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        status: STATUS_CODE.BAD_REQUEST,
        message: MESSAGE.NOT_DELETE_MESSAGE,
      });
    }

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.DELETE_SUCCESS_MESSAGE,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message ||MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// ********************************************************************

const getDiseaseDetails = async (req, res) => {
  try {
    const { admin: is_admin } = req.user; 
    const { uid: id } = req.user; 
    const personalInfo = await getDiseaseInfo(id, is_admin);

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.DISEASE_DETAILS,
      data: personalInfo,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.ERROR).send({
      status: STATUS_CODE.ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};



const addDiseaseInfo = async (req, res) => {
  try {
    const {
      body: { disease_type, disease_description },
    } = req;
    const { uid: id, email } = req.user;
    const familyExists = await checkFamilyInfo(id);
    if (!familyExists) {
      return res.send({ message: 'Please fill family info next.' });
    }
    
    const diseaseData = {
      disease_type,
      disease_description,
    };

    const result = await addDiseaseData(diseaseData, id);
    return res.status(STATUS_CODE.CREATED).send({
      status: STATUS_CODE.CREATED,
      message: MESSAGE.CREATED_DISEASEINFO_MESSAGE,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message:  error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const updateDiseaseInfo = async (req, res) => {
  try {
    const {
      body: { disease_type, disease_description },
    } = req;
    const { uid: id } = req.user;

    const formData = { disease_type, disease_description };

    const result = await updateDiseaseDetails(formData, id);

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.UPDATEINFO_SUCCESS_MESSAGE,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message:error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

const deleteDiseaseInfo = async (req, res) => {
  try {
    const { uid: id } = req.user;

    const deleteUser = await deleteDiseaseDetails(id);

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.DELETE_SUCCESS_MESSAGE,
      user: deleteUser,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message ||MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};

// **************************************************************************

const uploadDocument = async (req, res) => {
  console.log(" Received File:", req.file);
  console.log(" Received Body:", req.body);

  if (!req.file) {
    return res.status(STATUS_CODE.NOT_FOUND).send({
      status:STATUS_CODE.NOT_FOUND,
       message: MESSAGE.NO_FILE 
      });
  }

  const { document_type, user_id } = req.body;
  const diseaseExists = await checkDiseaseInfo(user_id);
  if (!diseaseExists) {
    return res.send({  message: 'Please fill disease info first.' });
  }


  if (!document_type || !user_id) {
    return res.status(STATUS_CODE.NOT_FOUND).send({
      status:STATUS_CODE.NOT_FOUND,
       message: MESSAGE.MISSING_REQUIRED 
      });
  }

  try {
    const result = await uploadFile(req.file);
    const documentUrl = result.secure_url;  

    const documentData = {
      document_type,
      document_url: documentUrl,
      user_id,
    };

    await saveDocument(documentData);

    return res.status(STATUS_CODE.CREATED).send({
      status:STATUS_CODE.CREATED,
      message:MESSAGE.DOCUMENT_UPLOAD,
      document_url: documentUrl, 
    });

  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message ||MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};


// ***********************************************************************
const checkUserSequence = async (req, res) => {
  try {
    const { uid: userId } = req.user;
    
    const progress = await checkUserProgress(userId);

    if (progress.step !== 'completed') {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        status: STATUS_CODE.BAD_REQUEST,
        message: progress.message,
      });
    }

    return res.status(STATUS_CODE.SUCCESS).send({
      status: STATUS_CODE.SUCCESS,
      message: MESSAGE.PROGRESS_COMPLETE,
    });

  } catch (error) {
    console.error(error.message);
    return res.status(STATUS_CODE.SERVER_ERROR).send({
      status: STATUS_CODE.SERVER_ERROR,
      message: error.message || MESSAGE.SERVER_ERROR_MESSAGE,
    });
  }
};


export default {
  uploadDocument,
checkUserSequence,
  personalInfo,
  updatePersonalInfo,
  getDiseaseDetails,
  getAllInfo,
  deletePersonalInfo,
  addFamilyInfo,
  getFamilyDetails,
  updateFamilyInfoDetails,
  deleteFamilyInfoDetails,
  addDiseaseInfo,
  updateDiseaseInfo,
  deleteDiseaseInfo,

};
