const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const OTPModel = require('../models/OTPModel')
const { SendMail } = require('../helper/EmailHelper')

exports.registration = (req, res) => {
    const reqBody = req.body;
    UserModel.create(reqBody)
        .then((data) => {
            res.status(200).json({ message: "Registration Sucessful", result: data })
        })
        .catch((error) => {
            res.status(200).json({ message: "Registration Failed", result: error })
        })
}

exports.login = (req, res) => {
    const reqBody = req.body;
    UserModel.aggregate([
        { $match: reqBody },
        { $project: { _id: 0, firstName: 1, lastName: 1, email: 1, mobile: 1, photo: 1 } }
    ])
        .then((data) => {
            if (data.length <= 0) {
                res.status(401).json({ message: "Unauthorized, please sign up" })
            }
            else {
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                    data: data[0].email
                }, 'SecretKey123456789')

                res.status(200).json({ message: "Login Successful", result: data[0], token: token })
            }
        })
        .catch((error) => {
            res.status(500).json({ message: "Login Failed", result: error })
        })
}

exports.ProfileUpdate = (req, res) => {
    const email = req.headers.email;
    const reqBody = req.body;
    if (!email) {
        res.status(401).json({ message: "Email not found" })
    }
    else {
        UserModel.updateOne({ email: email }, reqBody)
            .then((data) => {
                res.status(200).json({ message: "Profile update successful", result: data });
            })
            .catch((error) => {
                res.status(500).json({ message: "Profile update failed", result: error })
            })
    }
}

exports.GetUserProfile = (req, res) => {
    const email = req.headers.email;
    UserModel.aggregate([
        { $match: { email: email } },
        { $project: { _id: 1, firstName: 1, lastName: 1, email: 1, password: 1, photo: 1, mobile: 1 } }
    ])
        .then((data) => {
            res.status(200).json({ message: "Successful", result: data })
        })
        .catch((error) => {
            res.status(500).json({ message: "User data not found", result: error })
        })
}

exports.SendOTPVerifyingEmail = async (req, res) => {
    const { email } = req.body;
    const OTP = Math.floor(100000 + Math.random() * 900000);
    const reqBody = {
        email: email,
        otp: OTP
    }

    try {
        const user = await UserModel.aggregate([{ $match: { email: email } }, { $count: 'total' }])
        if (user.length <= 0) {
            res.status(200).json({ message: "fail", result: "User not found" })
        }
        else {
            const OTPCode = await OTPModel.create(reqBody);

            const sendEmail = await SendMail(email, 'Your PIN Code is = ' + OTPCode?.otp, 'Task Manager PIN Verification')
            res.status(200).json({ message: "Successful", result: sendEmail })
        }
    }
    catch (error) {
        res.status(200).json({ message: "fail", result: error })
    }

}

exports.VerifyOTP = async (req, res) => {
    const { email, OTP } = req.body
    const postBody = {
        status: 1
    }
    try {
        const OTPCount = await OTPModel.aggregate([{ $match: { $and: [{ email: email }, { otp: OTP }, { status: 0 }] } }, { $count: "total" }])
        if (OTPCount <= 0) {
            res.status(200).json({ message: "fail", result: "OTP is Expired" })
        }
        else {
            const OTPUpdate = await OTPModel.updateOne({ $and: [{ email: email }, { otp: OTP }, { status: 0 }] }, postBody)
            res.status(200).json({ message: "Successfully Verified", result: OTPUpdate })
        }
    }
    catch (error) {
        res.status(200).json({ message: "fail", result: error })
    }
}

exports.ResetPassword = async (req, res) => {
    const { password, email, OTP } = req.body;
    const postBody = {
        password: password
    }
    try {
        const OTPVerified = await OTPModel.aggregate([{ $match: { $and: [{ email: email }, { otp: OTP }, { status: 1 }] } }, { $count: "total" }])
        if (OTPVerified.length <= 0) {
            res.status(200).json({ message: "fail", result: "Invalid Request" })
        }
        else {
            const updatedPassword = await UserModel.updateOne({ email: email }, postBody)
            res.status(200).json({ message: "Password updated successfully", result: updatedPassword })
        }
    }
    catch (error) {
        res.status(200).json({ message: "fail", result: error })
    }
}