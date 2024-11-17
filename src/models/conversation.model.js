const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const conversationalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    // define is group chat or not
    isGroup: {
        type: Boolean,
        required: true,
        default: false
    },

    // for both group or sing chat user
    users: [
        {
            type: ObjectId,
            ref: "UserModel",
        }
    ],

    // for track the last message
    latestMessage: {
        type: ObjectId,
        ref: "MessageModel",
    },

    // for group admin
    admin: {
        type: ObjectId,
        ref: "UserModel",
    },
}, {
    collection: "conversations",
    timestamps: true
})

const ConversationModel = mongoose.model("ConversationModel", conversationalSchema)


module.exports = ConversationModel