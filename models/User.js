const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide your firstname'],
        minlength: 3,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: [true, 'Please provide your lastname'],
        minlength: 3,
        maxlength: 50,
    }, 
    email: {  
        type: String,  
        unique: true,
        index: true,
        required: [true, 'Please provide your email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email',
        },
    },
    password: {
        type: String, 
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number'],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    verificationToken: String,
    isVerified: {
        type: Boolean,
        default: false,   
    },
    verified: Date,
    passwordToken: {
        type: String,
    },
    passwordTokenExpirationDate: {
        type: Date,    
    }
})

UserSchema.pre('save', async function () {
    console.log(this.modifiedPaths())
    console.log(this.isModified('name'))
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign(
      { userId: this._id, name: this.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    );
  };
  

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)