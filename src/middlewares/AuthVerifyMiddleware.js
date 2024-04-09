const jwt = require('jsonwebtoken');

exports.AuthVerify = (req, res, next) => {
    const token = req.headers.token;
    jwt.verify(token, 'SecretKey123456789', function (err, decoded) {
        if (err) {
            res.status(401).json({ message: "Unauthorized, please login" })
        }
        else {
            const email = decoded.data
            req.headers.email = email;
            next();
        }
    })
}