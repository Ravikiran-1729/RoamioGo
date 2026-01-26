if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const Listing = require("../models/listing.model");
const Review = require("../models/review.model");
const AppError = require("../utils/AppError");

const createHotelListingService = async (listingData) => {
    try {
        listingData.service_location = {
            type : 'Point',
            coordinates : [listingData.lng, listingData.lat],
        };
        
        const doc = await Listing.create(listingData);

        if (!doc || !doc._id) {
            throw new AppError(500, "Unable to create listing. Please try again.");
        }

        return doc;
    } catch (error) {
        if (error.name === "ValidationError") {
            throw new AppError(400, error.message);
        }
        if (error.code === 11000) {
            throw new AppError(409, "Hotel is already listed!");
        }
        throw error;
    }
};

const showAllListedHotels = async () => {
    const listings = await Listing.find().select("_id image title price").lean();

    return listings;
};

const findListingById = async (id) => {
    const listing = await Listing.findById(id)
                                            .populate({
                                                path: 'reviews',
                                                select: 'content rating createAt auther',
                                                populate : {
                                                    path : 'auther',
                                                    select : 'username'
                                                }
                                            })
                                            .populate('owner', 'username')
                                            .lean();

    return listing;
};

const PLACEHOLDER_IMAGE = {
    filename: 'ListingImage',
    url: process.env.PLACEHOLDER_IMG,
};


const findListingByIdAndUpdate = async (id, listingData, files) => {
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new AppError(404, 'Listing not found');
    }

    const uploadedImages = files.map(file => ({
        filename: file.filename,
        url: file.path,
    }));

    // Create exactly 4 image slots
    const updatedImages = Array(4).fill(null).map((_, i) => {
        return listing.image[i]
            ? { ...listing.image[i] }
            : { ...PLACEHOLDER_IMAGE };
    });

    // Replace sequentially (no push)
    for (let i = 0; i < uploadedImages.length && i < 4; i++) {
        updatedImages[i] = uploadedImages[i];
    }

    listing.image = updatedImages;

    Object.assign(listing, listingData);

    await listing.save({ runValidators: true });

    return listing;
};



const findListingByIdAndDelete = async(id) =>{
        const result = await Listing.findByIdAndDelete(id);

        if(!result){
            throw new AppError(404, "Listing not found!");
        }

        return result;
}

const saveReview = async(reviewData, listingId) =>{
    const listing = await Listing.findById(listingId);

    if(!listing){
        throw new AppError(404, "Listing not found!");
    }

    const createdReview = await Review.create(reviewData);

    listing.reviews.push(createdReview._id);
    await listing.save();

    return createdReview;
};

const findListing = async(id) =>{
    if(!id) return;
    const listing = await Listing.findById(id);
    
    if(!listing) return;

    return listing;
}


module.exports = {
    createHotelListingService,
    showAllListedHotels,
    findListingById,
    findListingByIdAndUpdate,
    findListingByIdAndDelete,
    saveReview,
    findListing,
};
