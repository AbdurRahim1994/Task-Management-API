const mongoose = require('mongoose')
const { Schema } = mongoose

const OTPSchema = new Schema({
    otp: {
        type: String,
    },

    email: {
        type: String
    },

    status: {
        type: Number,
        default: 0
    },

    createdDate: {
        type: Date,
        default: Date.now()
    }
}, { versionKey: false })

const OTPModel = mongoose.model('otps', OTPSchema)
module.exports = OTPModel