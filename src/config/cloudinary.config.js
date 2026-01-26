if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET,
});


const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : process.env.FOLDER_NAME,
        allowed_formats :  ['png', 'jpg', 'jpeg'],
    }
});


const upload = multer({
    storage : storage,
    limits : {
        files: 4,
        fileSize: 2 * 1024 * 1024,
    }
});


module.exports = upload;
