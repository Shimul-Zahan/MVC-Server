const createHttpError = require("http-errors");
const logger = require("../configs/logger.config");
const { doesConversationExist, populateConversation, getuserConversations } = require("../services/conversation.services");
const UserModel = require("../models/user.model");
const ConversationModel = require("../models/conversation.model");

const create_open_conversation = async (req, res, next) => {
    try {

        const sender_id = req.user.userId
        const { receiver_id, isGroup } = req.body

        console.log(isGroup, "group or not");
        console.log(sender_id, "sender from line 12");
        console.log(receiver_id, "receiver from line 13");

        if (isGroup == false) {
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
                    picture: recevier?.image,
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
        } else {

            //this is for group conversation
            console.log("This is group chat");
        }

    } catch (error) {
        next(error)
    }
}

const getAllConversationForAUser = async (req, res, next) => {

    try {
        console.log("Hello from get all convo route");
        const user_id = req.user.userId
        // console.log(user_id);
        const conversations = await getuserConversations(user_id)
        res.json(conversations)

    } catch (error) {
        next(error)
    }

}

const createGroup = async (req, res, next) => {
    try {
        const { name, users } = req.body
        // add mine to the users list
        users.push(req.user.userId)

        console.log(name, users, "for group convo");

        if (!name || !users) {
            throw createHttpError.BadRequest("Please fill all fields")
        }
        if (users.lenght < 2) {
            throw createHttpError.BadRequest("Add atleast 2 users to the group")
        }
        let groupData = {
            name,
            users,
            isGroup: true,
            admin: req.user.userId,
            picture: 'https://cdn.pixabay.com/photo/2020/05/29/13/26/icons-5235125_1280.png',
        }

        let group = await ConversationModel.create(groupData)
        if (!group) {
            throw createHttpError.BadRequest("Failed to create group")
        }


        const populated_convo = await populateConversation(
            group._id,
            "users admin",
            "-password"
        )
        // console.log(populated_convo);
        res.status(200).json(populated_convo)

    } catch (error) {
        next(error)
    }
}


module.exports = { create_open_conversation, getAllConversationForAUser, createGroup }