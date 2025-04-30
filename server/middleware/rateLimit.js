const rateLimit = require('express-rate-limit');

const rateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again after 15 minutes.',
    keyGenerator: (req) => req.body.email || req.body.username || req.ip
});

module.exports = { rateLimitMiddleware };
