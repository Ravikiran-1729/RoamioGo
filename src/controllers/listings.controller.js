const asyncWrap = require("../utils/asyncWrap");
const listingServices = require("../services/listings.service");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


// Render new listing form
const renderNewListingForm = (req, res) => {
    res.render("listings/newListing.ejs" , {mapToken : process.env.MAPBOX_TOKEN});
};


// New Listing
const listNewHotel = asyncWrap(async (req, res) => {
    const listingData = req.body.listing;
    console.log(listingData);
    if(!req.files){
        req.flash('error', "Unable to upload your images! Please try again..");
        return res.redirect('/listings/new');
    }

    
    listingData.owner = req.user;
    listingData.image = [];

    const files = req.files;
    for(let file of files){
        let {filename, path} = file;
        listingData.image.push({
            url: path,
            filename: filename,
        });
    }

    

    await listingServices.createHotelListingService(listingData);

    req.flash('success', "Your listing added successfully!");
    res.redirect("/listings");

});



const renderAllListedHotels = asyncWrap(async (req, res) => {
    const listings = await listingServices.showAllListedHotels();

    if(!listings || listings.length <= 0){
        req.flash('error','Sorry, Hotels are not found' );
    }

    res.render("listings/listings.ejs", {
        listings,
        count: listings.length,
    });
});

const renderListingById = asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await listingServices.findListingById(id);

    if (!listing) {
        // throw new AppError(404, "Listing Not Found");
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }

    res.render("listings/show.ejs", {
        listing: listing,
        mapToken : process.env.MAPBOX_TOKEN,
    });
});

const renderEditListingForm = asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await listingServices.findListingById(id);

    if (!listing) {
        // throw new AppError(
        //     404,
        //     "Listing not found. Please check the URL and try again.",
        // );
        
        req.flash('error', 'Listing not found');
        return res.redirect(`/listings`);
    }

    for(let image of listing.image){
        let newUrl = image.url.replace('/upload', '/upload/w_500/q_auto:best/f_auto');
        image.url = newUrl;
    }

    res.render("listings/editListing.ejs", { listing });
});


const editListedHotel = asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listingData = req.body.listing;
    const files = req.files || [];

    listingData.owner = req.user;

    await listingServices.findListingByIdAndUpdate(id, listingData, files);

    req.flash('success', 'Listing Edited Successfully');
    res.redirect(`/listings/${id}`);
});



const deleteListedHotel = asyncWrap(async (req, res) =>{
        const {id} = req.params;
        await listingServices.findListingByIdAndDelete(id);
        
        req.flash("success", 'Listing deleted Successfully!');
        res.redirect('/listings');
});

const addNewReview = asyncWrap(async (req, res) =>{
    const {id} = req.params;
    const reviewData = req.body.review;

    if(!req.user){
        req.flash('error', "You must be logged in to perform this action");
        return res.render('/roamioGo/login');
    }

    reviewData.auther = req.user;

    reviewData.createAt = Date.now();

    await listingServices.saveReview(reviewData, id);
    
    req.flash("success", 'Review submitted Successfully!');
    return res.redirect(`/listings/${id}`);
});

module.exports = {
    renderNewListingForm,
    listNewHotel,
    renderAllListedHotels,
    renderListingById,
    renderEditListingForm,
    editListedHotel,
    deleteListedHotel,
    addNewReview,
};
