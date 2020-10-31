const User = require("../models/user")

const UserController = {}

UserController.getUsers = ()=>{
    return User.find()
}

UserController.getUser = (email)=>{
    return User.findOne({email})
}

UserController.storeUser = async (user) => {
    const exists = await UserController.getUser(user.email);
    if (exists) {
        throw new Error("User already exists");
    }
    const newUser = new User(user);
    return await newUser.save();;
};

module.exports = UserController