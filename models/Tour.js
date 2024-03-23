const mongoose = require('mongoose')


const TourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    amount: {
        type: Number, 
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    noOfPersons: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true,
    },
    minAge: {
        type: Number,
        required: true
    },
    included: {
        type: [String],
        required: true,
    }, 
    tourPlans: {
        type: [[String]],
        required: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    featured_tour: {
        type: Boolean,
        required: true
    }
}, { timestamps: true, toJSON: {virtuals: true }, toObject: { virtuals: true } })

TourSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'tour',

    justOne: false,
    match: { rating: 5 },
})

TourSchema.pre('remove', async function(next) {
    await this.model('Review').deleteMany({ product: this._id })
})

const Tour = mongoose.model('Tour', TourSchema)

module.exports = Tour
