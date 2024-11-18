const { createMessage, populateMessage, latestMessage } = require("../services/message.services");

const sendMessage = async (req, res, next) => {
    try {
        const user_id = req.user.userId
        const { message, files, convo_id } = req.body
        if (!convo_id || (!message && !files)) {
            console.log("Invalid message request...");
            return res.sendStatus(400)
        }

        //create message data to save in db
        const messageData = {
            sender: user_id,
            message,
            conversation: convo_id,
            files: files || [],
        }

        let newMessage = await createMessage(messageData)
        let populatedMessage = await populateMessage(newMessage._id)

        // here update the latest message cause if i send message then it would be the latest message
        await latestMessage(convo_id, newMessage)

        res.json(populatedMessage)

    } catch (error) {
        next(error)
    }
}


const getMessage = async (req, res, next) => {
    try {
        res.send("Get Messages")
    } catch (error) {
        next(error)
    }
}

module.exports = { sendMessage, getMessage }