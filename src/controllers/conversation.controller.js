const createHttpError = require("http-errors");
const logger = require("../configs/logger.config");
const doesConversationExist = require("../services/conversation.services");

const create_open_conversation = async (req, res, next) => {
    try {

        const sender_id = req.user.userId
        const receiver_id = req.body
        {/* check if reciver id is in */ }
        if (!receiver_id) {
            logger.error("Please provide a receiver id");
            throw createHttpError.BadGateway("Something went wrong")
        }

        // check if chat/ convo exist or not
        const existed_convo = await doesConversationExist(sender_id, receiver_id)

        // res.send("Hello")

    } catch (error) {
        next(error)
    }
}


module.exports = create_open_conversation