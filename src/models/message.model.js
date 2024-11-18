const mongoose = require('mongoose')
const validator = require('validator')
const { ObjectId } = mongoose.Schema.Types

const messageScheme = mongoose.Schema({

    sender: {
        // already in userlist so we only store the objectId
        type: ObjectId,
        ref: "UserModel",
    },
    message: {
        // already in userlist so we only store the objectId
        type: String,
        trim: true
    },
    conversation: {
        // for search any conversation
        type: ObjectId,
        ref: "ConversationModel",
    },
    files: [],
},
    {
        collection: "messages",
        timestamps: true
    },
)

const messageModel = mongoose.models.MessageModel || mongoose.model("UserModel", messageModel)

module.exports = messageModel