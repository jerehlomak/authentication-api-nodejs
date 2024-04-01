const Tour = require('../models/Tour')
const StatusCodes = require('http-status-codes')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2
const Joi = require('joi')

const getAllTours = async (req, res) => {
    const { search, category, location, duration, sort, priceMin, priceMax } = req.query
    const queryObject = {}

    if(search) {
        queryObject.name = { $regex: search, $options: 'i' }
    }
    if(category && category !== 'all') {
        queryObject.category = category
    }
    if(location && location !== 'all') {
        queryObject.location = location
    }
    if(duration && duration !== 'all') {
        queryObject.duration = duration
    }
    if(priceMin && priceMax) {
        queryObject.amount = { $gte: priceMin, $lte: priceMax }
    } else if (priceMin) {
        queryObject.amount = { $gte: priceMin }
    } else if (priceMax) {
        queryObject.amount = { $lte: priceMax }
    }

    let result = Tour.find(queryObject)
    if (sort === 'high') {
        result = result.sort({ amount: -1 })
    }
    if (sort === 'low') {
        result = result.sort({ amount: 1 })
    }
    if (sort === 'a-z') {
        result = result.sort('name')
    } 
    if (sort === 'z-a') {
        result = result.sort('-name')
    }


    const page = Number(req.query.page) || 1 
    const limit = Number(req.query.limit) || 10
    
    const skip = (page - 1) * limit 

    result = result.skip(skip).limit(limit)

    const tours = await result
    const totalTours = await Tour.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalTours / limit)

    res.status(StatusCodes.OK).json({ tours, totalTours, numOfPages })
}

const getSingleTour = async (req, res) => {
    const { id: tourId } = req.params

    const tour = await Tour.findOne({ _id: tourId }).populate('reviews')
    if (!tour) {
        throw new CustomError.NotFoundError(`No tour with id: ${tourId}`)
    }
    res.status(StatusCodes.OK).json({ tour })
}

const createTour = async (req, res) => {
    req.body.user = req.user.userId
    const result = await cloudinary.uploader.upload(
        req.files.images.tempFilePath,
        {
            use_filename: true,
            folder: 'file-upload',
        }
    )
    console.log(result);
    const tour = await Tour.create(req.body)
    
    res.status(StatusCodes.OK).json({ msg: 'tour successfully created' })
}


const updateTour = async (req, res) => {
    const { id: tourId } = req.params

    const tour = await Tour.findOneAndUpdate({ _id: tourId }, req.body, {
        new: true,
        runvalidators: true
    })

    if (!tour) {
        throw new CustomError.NotFoundError(`No tour with id: ${tourId}`)
    }

    res.status(StatusCodes.OK).json({ tour })
}

const deleteTour = async (req, res) => {
    const { id: tourId } = req.params

    const tour = await Tour.findOne({ _id: tourId })

    if (!tour) {
        throw new CustomError.NotFoundError(`No tour with id: ${tourId}`)
    }
    await tour.remove()
    res.status(StatusCodes.OK).json({ msg: 'Tour successfully deleted' })
}

const getSingleTourReview = async (req, res) => {
    
    res.status(StatusCodes.OK).json({ msg: 'tour review' })
}

module.exports = {
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
    createTour,
    getSingleTourReview
}


