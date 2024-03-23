const express = require('express')
const router = express.Router()

const {
    createReview,  
    updateReview,
    deleteReview,
    getAllReviews,
    getSingleReview
} = require('../controllers/reviewController')
const { authenticateUser } = require('../middleware/authentication')

router
    .route('/').post(authenticateUser, createReview)
    .get(getAllReviews)

router.route('/:id')
    .get(getSingleReview)
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview)

module.exports = router
 
