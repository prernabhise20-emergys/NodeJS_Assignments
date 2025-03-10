import multer from 'multer';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { 
        resource_type: 'raw', 
        public_id: `documents/${file.originalname}`,
        format: 'pdf' 
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};


export { upload, uploadFile };
