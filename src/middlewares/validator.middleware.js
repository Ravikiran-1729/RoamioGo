const {mongoose } = require("mongoose")
const AppError = require("../utils/AppError")
const modelValidation = require('../models/model.validation');

const validateObjectIdParams = (params) => (req, res, next)=>{
    if(!(mongoose.Types.ObjectId.isValid(req.params[params]))){
        throw new AppError(400, "Invalid Listing ID");
    }
    next();
}

const validateUserModel = (req, res, next) =>{
    const {error, value} = modelValidation.userValidator.validate(req.body);
    if(error){
        req.flash('error', error.details[0].message);
        return res.redirect('/roamioGo/signup');
    }
    next();
}


const validateReviewModel = (req, res, next) =>{
    const {id} = req.params;
    const {error, value} = modelValidation.reviewValidator.validate(req.body);
    if(error){
        req.flash('error', error.details[0].message);
        return res.redirect(`/listings/${id}`);
    }
    next();
}
const validateListingModel = (req, res, next) =>{
    const {error, value} = modelValidation.listingValidator.validate(req.body);
    if(error){
        req.flash('error', error.details[0].message);
        return res.redirect(`/listings/new`);
    }
    next();
}


module.exports = {
    validateObjectIdParams,
    validateUserModel,
    validateReviewModel,
    validateListingModel,
};