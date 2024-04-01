const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name']
    },
    email: {
        type: String,
        required: [true, 'Please provide email']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide rating']
    },
    title: {
        type: String,
        trim: true, 
        required: [true, 'Please provide review title']
    },
    comment: {
        type: String,
        required: [true, 'Please provide a review comment']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true
    }
}, { timestamps: true })

// ensure one user to one review per product
ReviewSchema.index({ tour: 1, user: 1 }, { unique: true })

ReviewSchema.statics.calculateAverageRating = async function (tourId) {
    const result = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 },
            }
        }
    ])
    try {
        await this.model('Tour').findOneAndUpdate({ _id: tourId }, {
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0,
        })
    } catch (error) {
        console.log(error)
    }
}

ReviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.tour)
})

ReviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.tour)
})

module.exports = mongoose.model('Review', ReviewSchema)