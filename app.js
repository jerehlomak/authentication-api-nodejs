require('dotenv').config()
require('express-async-errors')

//express
const express = require('express')
const app = express()
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})
//rest of the packages 
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// database
const connectDB = require('./db/connect')

// routers
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const TourRouter = require('./routes/TourRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const contactRouter = require('./routes/contactRoute')
const stripeController = require('./controllers/stripesController')

const depositController = require('./controllers/stripeController')

//middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1)
// app.use(
//     rateLimiter({
//         windowMs: 20 * 60 * 1000,
//         max: 100,
//     })
// )
app.use(mongoSanitize())
app.use(cors())
app.use(helmet())
app.use(xss())
app.post('/stripe')

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload({ useTempFiles: true }))

app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.use('/auth', authRouter) 
app.use('/user', userRouter)
app.use('/tour', TourRouter) 
app.use('/review', reviewRouter)
app.use('/contact', contactRouter)
app.post('/deposit', depositController.payWithFlutterwave)
app.post('/create-checkout-session', stripeController)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error) 
    }   
}

start()