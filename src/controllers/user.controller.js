const createHttpError = require("http-errors")
const searchUserService = require("../services/user.service")

const searchUsers = async (req, res, next) => {
    try {
        const keyword = req.query.search
        if (!keyword) {
            console.log("no keyword found");
            throw createHttpError.BadRequest("No keyword found")
        }
        const users = await searchUserService(keyword)
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

module.exports = { searchUsers }