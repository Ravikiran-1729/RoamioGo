const express = require('express');
const authMiddleware = require('../middlewares/authentication.middleware');
const router = express.Router();
const upload = require('../config/cloudinary.config');
const listingsController = require('../controllers/listings.controller');
const validator = require('../middlewares/validator.middleware');


// ------------STATIC ROUTES (BEFORE DYNAMIC ROUTES)---------------


// Show All Listed Hotels
router.get('/', listingsController.renderAllListedHotels);

// Render new listing form
router.get('/new',
    authMiddleware.isLoggedIn,
    listingsController.renderNewListingForm);

// TODO: Protect this route with authentication middleware
// Only authenticated users should be allowed to create new hotel listings
router.post('/new',
    authMiddleware.isLoggedIn,
    validator.validateListingModel,
    upload.array('images', 4),
    listingsController.listNewHotel
);



// ------------DYNAMIC ROUTES (AFTER STATIC ROUTES)---------------

// Render Specific Listing Details
router.get('/:id', 
            validator.validateObjectIdParams('id'), 
            listingsController.renderListingById
);

// TODO: Protect this route with authentication middleware
router.get('/:id/edit',
            validator.validateObjectIdParams('id'),
            authMiddleware.isLoggedIn,
            authMiddleware.isOwner,
            listingsController.renderEditListingForm
);

// TODO: Protect this route with authentication middleware
router.patch('/:id/edit', 
    validator.validateObjectIdParams('id'),
    authMiddleware.isLoggedIn,
    authMiddleware.isOwner,
    validator.validateListingModel,
    upload.array('images', 4),
    listingsController.editListedHotel
);

// TODO: Protect this route with authentication middleware
router.delete('/:id', 
    validator.validateObjectIdParams('id'),
    authMiddleware.isLoggedIn,
    authMiddleware.isOwner,
    listingsController.deleteListedHotel,
);

router.post('/:id/review', 
    validator.validateObjectIdParams('id'),
    authMiddleware.isLoggedIn,
    validator.validateReviewModel,
    listingsController.addNewReview
);

module.exports = router;