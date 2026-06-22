const mongoose = require('mongoose');
const Review = require('./review.model');
const Schema = mongoose.Schema;
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}



const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
        trim: true,
        set : v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
    },
    description :{
        type : String,
        required : true,
    },
    price : {
        type : Number,
        required : true,
        min : 1
    },
    image : { 
        type : [
                    {
                        filename : {
                            type : String,
                            default : 'ListingImage'
                        },
                        url : {
                            type : String,
                            default : process.env.PLACEHOLDER_IMG,
                            set : (v) => v === '' ? process.env.PLACEHOLDER_IMG : v,
                        },
                    }
                ],
        validate : {
            validator : (v) => v.length === 4,
            message: 'Exactly 4 images are required',
        } 
    },
    location : {
        type : String,
        required : true,
        trim: true,
        set : (v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
    },
    country : {
        type : String,
        required : true,
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Review',
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    service_location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            default : 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.index({title : 1, location : 1}, {unique : true});


listingSchema.post('findOneAndDelete', async function (data) {
    if(!data?.reviews?.length) return ;

    await Review.deleteMany({_id : {$in : data.reviews}})
});


const Listing = mongoose.model('Listing', listingSchema);

// Listing.createIndexes();
module.exports = Listing;
