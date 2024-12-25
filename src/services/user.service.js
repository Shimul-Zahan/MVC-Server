const { UserModel } = require("../models")

const searchUserService = async (keyword) => {
    const user = UserModel.find({
        $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { email: { $regex: keyword, $options: 'i' } },
        ]
    })
    return user
}

module.exports = searchUserService