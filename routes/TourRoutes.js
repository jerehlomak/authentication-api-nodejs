const express = require('express')
const router = express.Router()
const {
    authorizePermissions, authenticateUser
} = require('../middleware/authentication')

const { 
    getAllTours,
    getSingleTour,
    createTour,
    updateTour,
    deleteTour
 } = require('../controllers/tourController')
const { getSingleTourReviews } = require('../controllers/reviewController')

router.route('/')
        .post([authenticateUser, authorizePermissions('admin')], createTour)
        .get(getAllTours)

router.route('/:id')
        .get(getSingleTour) 
        .patch([authenticateUser, authorizePermissions('admin')], updateTour)
        .delete([authenticateUser, authorizePermissions('admin')], deleteTour)

router.route('/:id/reviews').get(getSingleTourReviews)

module.exports = router


