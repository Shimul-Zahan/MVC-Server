const createHttpError = require("http-errors")
const { createUser, signUser } = require("../services/auth.services")
const { generateToken, verifyToken } = require("../services/token.services")
const { UserModel } = require("../models")

const register = async (req, res, next) => {
    try {
        const { name, email, image, status, password } = req.body
        const newUser = await createUser({
            name,
            email,
            image,
            status,
            password,
        })

        const access_token = await generateToken(
            { userId: newUser._id },
            "1d",
            process.env.ACCESS_TOKEN_SECRET
        )

        const refresh_token = await generateToken(
            { userId: newUser._id },
            "30d",
            process.env.REFRESH_TOKEN_SECRET
        )

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/v1/auth/refreshtoken',
            maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
        })
        // console.log(access_token, refresh_token);

        res.status(201).json({
            message: "register sucess. ",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                image: newUser.image,
                status: newUser.status,
                access_token,
            }
        })

    } catch (error) {
        console.error('Error during user registration:', error);
        let statusCode = error.status || 500;

        if (error.name === 'ValidationError') {
            statusCode = 400;
        }
        res.status(statusCode).json({ message: error.message });
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await signUser(email, password)

        // heres token work procedure
        const access_token = await generateToken(
            { userId: user._id },
            "1d",
            process.env.ACCESS_TOKEN_SECRET
        )

        const refresh_token = await generateToken(
            { userId: user._id },
            "30d",
            process.env.REFRESH_TOKEN_SECRET
        )

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/v1/auth/refreshtoken',
            maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
        })

        res.status(201).json({
            message: "login sucess. ",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                status: user.status,
                access_token,
            }
        })
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

const logout = async (req, res, next) => {
    try {

        res.clearCookie('refreshtoken', {
            path: '/api/v1/auth/refreshtoken'
        })
        res.json({ message: 'Logout successfully' })

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

const refreshToken = async (req, res, next) => {
    try {

        const refresh_token = req.cookies.refreshtoken;
        console.log(refresh_token);

        if (!refresh_token) {
            throw createHttpError.Unauthorized('Please login')
        }

        // verify this token
        const check = await verifyToken(
            refresh_token,
            process.env.REFRESH_TOKEN_SECRET
        )


        const user = await UserModel.findById(check.userId)

        if (!user) {
            throw createHttpError.BadRequest("Session expired please login")
        }


        const access_token = await generateToken(
            { userId: user._id },
            "1d",
            process.env.ACCESS_TOKEN_SECRET
        )

        res.status(201).json({
            message: "login sucess. ",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                status: user.status,
                access_token,
            }
        })

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

module.exports = { login, logout, refreshToken, register }