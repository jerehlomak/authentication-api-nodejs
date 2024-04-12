const express = require('express')
const router = express.Router()

const {
    createReview,  
    updateReview,
    deleteReview,
    getAllReviews,
    getSingleReview
} = require('../controllers/reviewController')
const { authenticateUser, authUser } = require('../middleware/authentication')

router
    .route('/').post(authUser, createReview)
    .get(getAllReviews)

router.route('/:id')
    .get(getSingleReview)
    .patch(authUser, updateReview)
    .delete(authUser, deleteReview)

module.exports = router
 
