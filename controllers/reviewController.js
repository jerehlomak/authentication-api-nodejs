const Tour = require('../models/Tour')
const Review = require('../models/Review')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions
} = require('../utils')

const createReview = async (req, res) => {
    const { tour: tourId } = req.body

    const isValidTour = await Tour.findOne({ _id: tourId })
    if (!isValidTour) {
        throw new CustomError.NotFoundError(`No tour with id: ${tourId}`)
    }

    const alreadySubmitted = await Review.findOne({ 
        tour: tourId,
        user: req.user.userId,
    })
    if (alreadySubmitted) {
        throw new CustomError.BadRequestError('Already submitted review for this tour')
    }

    req.body.user = req.user.userId 
    const review = await Review.create(req.body)

    res.status(StatusCodes.CREATED).json({ review })
}

const getSingleReview = async (req, res) => {
    const { id: reviewId } = req.params
    const review = await Review.findOne({ _id: reviewId })

    if (!review) {
        throw new CustomError.NotFoundError(`No review with the id ${reviewId}`)
    }

    res.status(StatusCodes.OK).json({ review })
}

const updateReview = async (req, res) => {
    const { id: reviewId } = req.params

    const { rating, title, comment } = req.body

    const review = await Review.findOne({ _id: reviewId })
    if (!review) {
        throw new CustomError.NotFoundError(`No review with the id ${reviewId}`)
    }

    checkPermissions(req.user, review.user)
    
    review.rating = rating
    review.title = title
    review.comment = comment

    await review.save()
    res.status(StatusCodes.OK).json({ review })
}

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params

    const review = await Review.findOne({ _id: reviewId })
    if (!review) {
        throw new CustomError.NotFoundError(`No review with the id ${reviewId}`)
    }

    checkPermissions(req.user, review.user)
    await review.remove()
    res.status(StatusCodes.OK).json({ msg: 'Review successfully deleted' })
}

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({})
    .populate({
        path: 'tour',
        select: 'name category amount' 
    })
    .populate({
        path: 'user',
        select: 'firstName' 
    })

    res.status(StatusCodes.OK).json({ reviews })
}

// all reviews of a particular tour
const getSingleTourReviews = async (req, res) => {
    const { id: tourId } = req.params

    const reviews = await Review.find({ tour: tourId }).populate({
        path: 'user',
        select: 'firstName lastName'
    })

    res.status(StatusCodes.OK).json({ reviews, count: reviews.length, msg: 'Successfully added your review' })
}

module.exports = {
    createReview,
    updateReview, 
    deleteReview,
    getSingleReview,
    getAllReviews,
    getSingleTourReviews
}