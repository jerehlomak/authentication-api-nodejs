const express = require('express')
const router = express.Router()
const multer = require('multer')
const {
    authorizePermissions, authenticateUser, authUser
} = require('../middleware/authentication')

const { 
    getAllTours,
    getSingleTour,
    createTour,
    updateTour,
    deleteTour,
    uploadImage
 } = require('../controllers/tourController')
const { getSingleTourReviews } = require('../controllers/reviewController')
const upload = multer({ dest: 'uploads/' });

router.route('/upload', upload.array('images', 5)).post(uploadImage)

router.route('/',  upload.array('images', 5))
        .post([authUser, authorizePermissions('admin')], createTour)
        .get(getAllTours)

router.route('/:id')
        .get(getSingleTour) 
        .patch([authUser, authorizePermissions('admin')], updateTour) 
        .delete([authUser, authorizePermissions('admin')], deleteTour)

router.route('/:id/reviews').get(getSingleTourReviews)

module.exports = router


