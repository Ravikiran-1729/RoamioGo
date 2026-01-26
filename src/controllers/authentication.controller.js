const authService = require('../services/authentication.service');
const AppError = require('../utils/AppError');
const asyncWrap = require('../utils/asyncWrap');

const renderSignupForm = (req, res)  =>{
    return res.render('authentication/signup.ejs');
}

const renderLoginForm = (req, res) =>{
    return res.render('authentication/login.ejs');
}

const signUp = asyncWrap(async (req, res, next) =>{
    const {username, email, password, repeat_password} = req.body.user;
    try {
        const registeredUser = await authService.registerUser({username, email}, password);

        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            
            req.flash('success', "Signed up successfully");
            return res.redirect('/listings');
        });

    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/roamioGo/signup');
    }

});


const login =  (req, res) =>{
    const url =  req.cookies.returnTo || '/listings';
    res.clearCookie('returnTo');
    req.flash("success", "Welcome back to roamioGo!");
    res.redirect(`${url}`);
};


const logout = (req, res) =>{
    req.logout((err) =>{
        if(err){
            throw new AppError(500, err.message);
        }
        req.flash("success", "Your are logged out!");
        return res.redirect("/roamioGo/login");
    });
}



module.exports = {
    renderSignupForm,
    signUp,
    renderLoginForm,
    login,
    logout,
}