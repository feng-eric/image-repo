const jwt = require('jsonwebtoken');

// https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js/
const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization')

    if (authHeader) {
        const token = authHeader.split(' ')[1]

        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        })
    } else {
        res.sendStatus(401);
    }
}

module.exports = authenticateJWT;