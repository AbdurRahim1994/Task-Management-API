const express = require('express');
const app = express();
const router = require('./src/routes/api');
const mongoose = require('mongoose')

//Security middleware import
const bodyParser = require('body-parser')
const cors = require('cors')
const expressMongoSanitize = require('express-mongo-sanitize')
const expressRateLimit = require('express-rate-limit')
const helmet = require('helmet')
const hpp = require('hpp')
const xssClean = require('xss-clean');

//Security middleware implement
app.use(bodyParser.json())
app.use(cors())
app.use(expressMongoSanitize())
app.use(helmet())
app.use(hpp())
app.use(xssClean());

//Configure Rest API Size
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb" }))

//Rate limit
const limiter = expressRateLimit({
    windowMs: 1000 * 60 * 15,
    max: 3000
})
app.use(limiter)

//Route 
app.use('/api/v1', router);

//Database connection
const uri = 'mongodb://127.0.0.1:27017/TaskManager';
const options = { user: '', pass: '' }
mongoose.connect(uri, options)
    .then(() => {
        console.log("Data connection successful")
    })
    .catch((error) => {
        console.log(error)
    })

//Invalid API
app.use('*', (req, res) => {
    res.status(404).json({ message: "Failed", result: "Not Found" })
})

module.exports = app;
