const {findListing} = require('../services/listings.service');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        if (req.method === "GET") {
            res.cookie('returnTo',`${req.originalUrl}`);
        }

        req.flash("error", "You must be logged in to perform this action.");
        return res.redirect("/roamioGo/login");
    }

    next();
};


const isOwner = async(req, res, next) =>{
    const {id} = req.params;

    const listing = await findListing(id);

    if( !listing || !listing.owner.equals(req.user._id)){
        req.flash('error', "You don't have access to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = { isLoggedIn ,isOwner};
