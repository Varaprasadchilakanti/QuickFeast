const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Apply middleware globally
const applyMiddleware = (app) => {
    app.use(helmet()); // Security headers

    // Rate limiting for API routes
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // Limit each IP to 100 requests per windowMs
    });
    app.use('/api/', apiLimiter);
};

module.exports = applyMiddleware;
