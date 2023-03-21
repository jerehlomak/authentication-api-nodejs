const createTokenUser = require('./createTokenUser')
const { createJWT,
    isTokenValid,
    attachCookiesToResponse, } = require('./jwt')
const checkPermissions = require('./checkPermissions')
const sendVerificationEmail = require('./sendVerificationEmail')
const sendResetPasswordEmail = require('./sendResetPasswordEmail')
const createHash = require('./createHash')

module.exports = {
    createTokenUser,
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    checkPermissions,
    sendVerificationEmail,
    sendResetPasswordEmail,
    createHash,

}