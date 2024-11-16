const mongoose = require('mongoose')
const validator = require('validator')

const userScheme = mongoose.Schema({
    name: {
        type: String,
        // for using validation text
        required: [true, "Please provide your name"]
    },
    email: {
        type: String,
        // for using validation text
        required: [true, "Please provide your email adress"],
        unique: [true, "This email adress already used"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email adress"]
    },
    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png"
    },
    status: {
        type: String,
        default: "Hey there ! I am using Bok Bok"
    },
    password: {
        type: String,
        required: [true, "Please provide a valid password"],
        minLength: [
            6,
            "Please make sure your password is atleast 6 character long",
        ],
    },
},
    {
        collection: "users",
        timestamps: true
    },
)

const UserModel = mongoose.model("UserModel", userScheme)

module.exports = UserModel