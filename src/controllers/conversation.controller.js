const createHttpError = require("http-errors");
const logger = require("../configs/logger.config");
const { doesConversationExist, populateConversation, getuserConversations } = require("../services/conversation.services");
const UserModel = require("../models/user.model");
const ConversationModel = require("../models/conversation.model");

const create_open_conversation = async (req, res, next) => {
    try {

        const sender_id = req.user.userId
        const { receiver_id } = req.body
        console.log(sender_id, "sender from line 12");
        console.log(receiver_id, "receiver from line 13");
        {/* check if reciver id is in */ }
        if (!receiver_id) {
            logger.error("Please provide a receiver id");
            throw createHttpError.BadGateway("Something went wrong")
        }

        // check if chat/ convo exist or not
        const existed_convo = await doesConversationExist(sender_id, receiver_id)

        // if chat or convo exist
        if (existed_convo) {
            res.json(existed_convo)
        } else {

            const recevier = await UserModel.findById(receiver_id)
            let convoData = {
                // convo name here
                name: recevier.name,
                isGroup: false,
                users: [sender_id, receiver_id]
            }

            // create new convo here
            const newConvo = await ConversationModel.create(convoData)
            if (!newConvo) {
                throw createHttpError.BadRequest("Ops something went wrong");
            }

            // populate the sender and receiver info here
            const populateConvoUserDetails = await populateConversation(
                // kon convo er data populate koro
                newConvo._id,
                // which data should i populate
                "users",
                // which field we don't populate
                "-password"
            )

            res.json(populateConvoUserDetails)

        }

    } catch (error) {
        next(error)
    }
}

const getAllConversationForAUser = async (req, res, next) => {

    try {
        console.log("Hello from get all convo route");
        const user_id = req.user.userId
        const conversations = await getuserConversations(user_id)
        
        res.json(conversations)

    } catch (error) {

        next(error)

    }

}



module.exports = { create_open_conversation, getAllConversationForAUser }