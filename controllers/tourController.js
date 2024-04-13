const Tour = require('../models/Tour')
const StatusCodes = require('http-status-codes')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2
const Joi = require('joi')
const multer = require('multer')
const fs = require('fs');
const { resolve } = require('path')

const upload  = multer({ dest: 'uploads/' })

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
    const limit = Number(req.query.limit) || 5 
    
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
    console.log(req.body)
    try {
        req.body.user = req.user.userId;
    
        const tour = await Tour.create(req.body);    
        res.status(StatusCodes.OK).json({ tour });
        //res.status(StatusCodes.OK).json({ msg: 'Tour successfully created', tour });
    } catch (error) {
        console.error('Error creating tour:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create tour' });
    }
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
const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: 'auto'
}

const uploadImage = async (req, res) => {
    try {
        const uploadPromises = req.files.images.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.tempFilePath, {
            use_filename: true,
            folder: 'file-upload',
          });
          fs.unlinkSync(file.tempFilePath);
          return { src: result.secure_url };
        });
    
        const uploadedImages = await Promise.all(uploadPromises);
        return res.status(StatusCodes.OK).json({ images: uploadedImages });
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
      }
  };

const uploadImages = (image) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (error, result) => {
            if (result && result.secure_url) {
                console.log(result.secure_url)
                return resolve(result.secure_url)
            }
            console.log(error.message)
            return reject({ message: error.message })
        })
    })

  };

const uploadImagess = async (req, res) => {
    uploadImages(req.body.images)
        .then((url) => res.send(url))
        .catch((err) => res.status(500).send(err))
   
} 



module.exports = {
    getAllTours,
    getSingleTour,
    updateTour,
    deleteTour,
    createTour,
    getSingleTourReview,
    uploadImage
}


