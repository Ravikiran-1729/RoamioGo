const joi = require('joi');

const reviewValidator = joi.object({
    review: joi.object({
        rating: joi.number().integer().min(1).max(5).required().messages({
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating must be at most 5',
        }),
        content: joi.string().trim().min(10).max(500).required().messages({
            'string.min': 'Review must be at least 10 characters long',
            'string.max': 'Review must be at most 500 characters long',
            'string.empty': 'Review cannot be empty'
        })
    }).required()
});

const userValidator = joi.object({
    user: joi.object({
        username: joi.string().trim().min(3).max(30).required().messages({
                "string.min": "Username must be at least 3 characters long",
                "string.max": "Username cannot exceed 30 characters",
                "string.empty": "Username is required",
            }),

        email: joi.string().trim().required().email({ minDomainSegments: 2 }),

        password: joi.string().trim().min(8).max(50).required().messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password must be at most 50 characters long',
            'string.empty': 'Password cannot be empty',
        }),

        repeat_password: joi.ref('password'),
    }).required().with('password', 'repeat_password')
});


const listingValidator = joi.object({
    listing: joi.object({
        title: joi.string().trim().min(3).max(30).required().messages({
            'string.min' : 'Title must be at least 3 characters long',
            'string.max' : 'Title must be at most 30 characters long',
            'string.empty' : 'Title cannot be empty'
        }),
        description: joi.string().trim().min(10).required().messages({
            'string.min' : 'Description must be at least 10 characters long',
            'string.empty' : 'Description cannot be empty'
        }),
        price: joi.number().min(1).required().integer().messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price must be at least 1 rupee'
        }),
        location: joi.string().trim().required(),
        country: joi.string().trim().required(),
        lng : joi.number().required(),
        lat : joi.number().required(),
    }).required(),
});


module.exports = {
    reviewValidator,
    userValidator,
    listingValidator, 
};