const CustomError = require('../errors')
const jwt = require('jsonwebtoken');
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

const authUser = async (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new CustomError.UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      
      // attach the user to the job routes
      req.user = { userId: payload.userId, role: payload.role };
      next();
    } catch (error) {
        console.log(error)
      throw new CustomError.UnauthenticatedError('Authentication invalid');
    }
  };

// only  admin can access this route
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        console.log(roles, req.user);
        if(!roles.includes('admin')){ 
            throw new CustomError.UnauthenticatedError('Unauthorized to access this route')
        }
        // if (payload.role !== 'admin' && payload.role === 'user') {
        //     throw new CustomError.UnauthorizedError('Unauthorized access');
        //   }
        next() 
    }
}

module.exports = {
    authenticateUser,
    authorizePermissions,
    authUser
}