const createHttpError = require("http-errors")
const validator = require('validator')
const bcrypt = require('bcrypt')
const { UserModel } = require("../models")

const createUser = async (data) => {
    const { name, email, image, status, password } = data

    if (!name || !email || !password) {
        throw createHttpError.BadRequest("Please fill all required fields")
    }

    if (!validator.isEmail(email)) {
        throw createHttpError.BadRequest("Make provide a valid email adress")
    }

    // check email uniqeness 
    const checkDB = await UserModel.findOne({ email });
    if (checkDB) {
        throw createHttpError.Conflict("Please try again with different email adress.")
    }

    // create a new instance of a user
    console.log({ name, email, image, status, password }, "form services");
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await new UserModel({
        name,
        email,
        image,
        status,
        password: hashedPassword,
    }).save()

    return user;
}


const signUser = async (email, password) => {

    console.log(email);

    const user = await UserModel.findOne({ email: email.toLowerCase() })

    // check email exist or not
    if (!user) {
        throw createHttpError.NotFound('Invalid crediential');
    }

    // check password
    let passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        throw createHttpError.NotFound("Invalid Password")
    }

    return user
}


module.exports = { createUser, signUser }