import cloudinary from 'cloudinary';

import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

const uploadCloudinary = async (file) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path,
      {
        folder: 'uploads',
      });
    return result.secure_url;
  } catch (error) {
    console.log(error.message);
  }
};

export default uploadCloudinary;