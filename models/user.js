const mongoose = require("mongoose")
const { Schema } = mongoose

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    username: String
})

const userModel = mongoose.model("User", UserSchema)

module.exports = userModel