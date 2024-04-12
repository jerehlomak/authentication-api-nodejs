const express = require('express')
const router = express.Router()
const {
    authenticateUser,
    authorizePermissions,
    authUser
} = require('../middleware/authentication')
const {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
} = require('../controllers/userController')

router.route('/').get(authUser, authorizePermissions('admin'), getAllUsers)
router.route('/showMe').get(authUser, showCurrentUser)
router.route('/updateUser').post(authUser, updateUser)
router.route('/updateUserPassword').post(authUser, updateUserPassword)
router.route('/:id').get(authUser, getSingleUser)

module.exports = router