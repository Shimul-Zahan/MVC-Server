const createHttpError = require("http-errors")
const MessageModel = require("../models/message.model")
const ConversationModel = require("../models/conversation.model")

const createMessage = async (messageData) => {
    try {

        let newMessage = await MessageModel.create(messageData)
        if (!newMessage) throw createHttpError.BadRequest("Oops unable to send message...");
        return newMessage

    } catch (error) {
        throw createHttpError.BadRequest("Unable to send message.")
    }
}


const populateMessage = async (message_id) => {
    try {

        // get the message and populate message data like sender data convo info
        let message = await MessageModel.findById(message_id)
            .populate({
                path: 'sender',
                select: "name image",
                model: "UserModel"
            })
            .populate({
                path: 'conversation',
                select: 'name isGroup users',
                model: 'ConversationModel',
                populate: {
                    path: 'users',
                    select: 'name email image status'
                }
            });

        if (!message) throw createHttpError.BadRequest('Oops unable to populate data...')

        return message

    } catch (error) {
        throw createHttpError.BadRequest("Unable to populate message data.")
    }
}

const latestMessage = async (convo_id, message) => {
    try {

        const updatedMessage = await ConversationModel.findByIdAndUpdate(convo_id, {
            latestMessage: message
        })

        if (!updatedMessage) throw createHttpError.BadRequest("Unable to populate message data.")

        return updatedMessage

    } catch (error) {

    }
}

module.exports = { createMessage, populateMessage, latestMessage }