const path = require('path');
// require('dotenv').config({path : path.resolve(__dirname, '../../.env')});

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({path : path.resolve(__dirname, '../../.env')});
}

const mongoose = require('mongoose');

// const MONGOURL = process.env.MONGOURL;
const ATLASURL = process.env.ATLAS_URL;

// const connectDB = async () =>{
//     await mongoose.connect(ATLASURL);
//     console.log("✅ Database Connected Successfully");
// };
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(ATLASURL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err);
    throw err;
  }
};

module.exports = connectDB;
