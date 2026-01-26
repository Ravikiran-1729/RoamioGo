const mongoose = require('mongoose');
const { create } = require('./listing.model');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    content : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    auther : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    createAt : {
        type : Date,
        default : Date.now(),
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;