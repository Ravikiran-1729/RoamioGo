const User = require('../models/user.model');


const registerUser = async (user, password) =>{
    
    const newUser = new User({
        username : user.username,
        email : user.email,
    });

    const registeredUser = await User.register(newUser, password);
    return registeredUser;
};

module.exports = {
    registerUser,
}