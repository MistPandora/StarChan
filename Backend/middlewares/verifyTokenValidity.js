const jwt = require('jsonwebtoken');

const verifyTokenValidity = (req, res, next) => {
    const authorization = req.headers['authorization'];

    if (!authorization) {
        return res.status(401).json({ result: false, error: "Unauthorized access" })
    }

    const token = authorization.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ result: false, error: 'Connection has expired', isTokenExpired: true });
        }
        res.status(401).json({ result: false, error: 'Unauthorized access' });
    }
}

module.exports = verifyTokenValidity;