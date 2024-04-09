const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController')
const AuthVerify = require('../middlewares/AuthVerifyMiddleware')
const TaskController = require('../controllers/TaskController')

router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.post('/ProfileUpdate', AuthVerify.AuthVerify, UserController.ProfileUpdate)
router.get('/GetUserProfile', AuthVerify.AuthVerify, UserController.GetUserProfile)

router.post('/createTask', AuthVerify.AuthVerify, TaskController.createTask)
router.post('/updateTask/:id', AuthVerify.AuthVerify, TaskController.updateTask)
router.delete('/deleteTask/:id', AuthVerify.AuthVerify, TaskController.deleteTask)
router.get('/listOfTaskByStatus/:status', AuthVerify.AuthVerify, TaskController.listOfTaskByStatus)
router.get('/taskStatusCount', AuthVerify.AuthVerify, TaskController.taskStatusCount)

router.post('/SendOTPVerifyingEmail', UserController.SendOTPVerifyingEmail)
router.post('/VerifyOTP', UserController.VerifyOTP)
router.post('/ResetPassword', UserController.ResetPassword)

module.exports = router;