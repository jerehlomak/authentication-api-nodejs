const CustomError = require('../errors')
const Token = require('../models/Token')
const { isTokenValid, attachCookiesToResponse } = require('../utils')

const authenticateUser = async (req, res, next) => {
    const { accessToken, refreshToken } = req.signedCookies

    try {
        if(accessToken) {
            const payload = isTokenValid(accessToken)
            req.user = payload.user
            return next()
        }
        const payload = isTokenValid(refreshToken)
        // check if there's an existing token
        const existingToken = await Token.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken
        })

        if (!existingToken || !existingToken?.isValid) {
            throw new CustomError.UnauthenticatedError('Authentication Invalid')
        }

        attachCookiesToResponse({
            res, 
            user: payload.user,
            refreshToken: existingToken.refreshToken
        })

        req.user = payload.user
        next()

    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid')
    }
}

// only  admin can access this route
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            throw new CustomError.UnauthenticatedError('Unauthorized to access this route')
        }
        next()
    }
}

module.exports = {
    authenticateUser,
    authorizePermissions,
}