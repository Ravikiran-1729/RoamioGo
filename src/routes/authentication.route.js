const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authentication.controller')
const {validateUserModel} = require('../middlewares/validator.middleware');
const passport = require('passport');

router.get('/signup', authenticationController.renderSignupForm);

router.post('/signup',
    validateUserModel,
    authenticationController.signUp);

router.get('/login', authenticationController.renderLoginForm);
router.post('/login',
    passport.authenticate('local', {failureFlash : true, failureRedirect : '/roamioGo/login'}),
    authenticationController.login
);

router.get('/logout', authenticationController.logout);

module.exports = router;