const createHttpError = require("http-errors")
const ConversationModel = require("../models/conversation.model");
const UserModel = require("../models/user.model");

const doesConversationExist = async (sender_id, receiver_id, isGroup) => {
    if (isGroup == false) {
        let convos = await ConversationModel.find({
            isGroup: false,
            // check there is any convo between them
            $and: [
                { users: { $elemMatch: { $eq: sender_id } } },
                { users: { $elemMatch: { $eq: receiver_id } } },
            ]
        })
            // populate this users and the latest message
            .populate("users", '-password')
            .populate("latestMessage")

        if (!convos) createHttpError.BadRequest("Oooops something went wrong");

        // 1. if convo exist then check the latest message sender
        // 2. Populate message model

        convos = await UserModel.populate(convos, {
            path: 'latestMessage.sender',
            select: "name email image status"
        })

        // cause convo is an array
        return convos[0]

    } else {
        let convo = await ConversationModel.findOne(
            {
                _id: isGroup,
                isGroup: true,
            }
        )
            .populate("users admin", '-password')
            .populate("latestMessage")

        if (!convo) createHttpError.BadRequest("Oooops something went wrong");

        convo = await UserModel.populate(convo, {
            path: 'latestMessage.sender',
            select: "name email image status"
        })

        // cause convo is an array
        return convo
    }
}

const populateConversation = async (id, fieldToPopulaate, fieldsToRemove) => {

    const populateConvo = await ConversationModel.findOne({ _id: id }).populate(
        fieldToPopulaate,
        fieldsToRemove
    );

    // if populate convo noo exist
    if (!populateConvo) {
        throw createHttpError.BadRequest("Something went wrong")
    }

    return populateConvo

}


const getuserConversations = async (user_id) => {

    let convos;
    await ConversationModel.find({
        users: { $elemMatch: { $eq: user_id } }
    })
        .populate("users", "-password")
        .populate("admin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (result) => {
            result = await UserModel.populate(result, {
                path: "latestMessage.sender",
                select: 'name email image status'
            });
            convos = result
        }).catch((err) => {
            throw createHttpError.BadRequest("Something went wrong")
        })
    return convos
}


module.exports = { doesConversationExist, populateConversation, getuserConversations }