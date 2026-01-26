const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {default : passportLocalMongoose} = require('passport-local-mongoose');

const Listing = require('./listing.model');
const Review = require('./review.model');


const userSchema = new Schema({
    email : {
        type : String,
        required : true
    }
});

userSchema.plugin(passportLocalMongoose);

userSchema.post('findOneAndDelete', async(data) =>{
    if(!data || !data._id) return;

    await Listing.deleteMany({owner : data._id});
});

userSchema.post('findOneAndDelete', async (data) =>{
    if(!data || !data._id) return;

    await Review.deleteMany({auther : data._id});
});

const User = mongoose.model('User', userSchema);

module.exports = User;
