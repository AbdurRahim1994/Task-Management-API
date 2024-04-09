const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    email: {
        type: String,
        unique: true
    },

    mobile: {
        type: String
    },

    photo: {
        type: String
    },

    password: {
        type: String
    },

    createdDate: {
        type: Date,
        default: Date.now()
    }
}, { versionKey: false })

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;