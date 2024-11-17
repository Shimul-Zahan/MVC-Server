const mongoose = require('mongoose')
const validator = require('validator')
const { ObjectId } = mongoose.Schema.Types

const messageScheme = mongoose.Schema({
    sender: {
        type: ObjectId,
        ref: "UserModel",
    },
},
    {
        collection: "messages",
        timestamps: true
    },
)

const UserModel = mongoose.model("UserModel", userScheme)

module.exports = UserModel