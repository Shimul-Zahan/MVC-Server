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
                select: 'name picture isGroup users',
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

const getMessages = async (id) => {
    try {
        const messages = await MessageModel.find({ conversation: id })
            .populate({
                path: 'sender',
                select: 'name email image status'
            })
            .populate('conversation')

        if (!messages) throw createHttpError.BadRequest("Something went wromg")

        return messages

    } catch (error) {
        throw createHttpError.BadRequest("Unable to process message data.")
    }
}


module.exports = { createMessage, populateMessage, latestMessage, getMessages }