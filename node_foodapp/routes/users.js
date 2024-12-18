const express = require('express');
const User = require('../models/User'); // Ensure you have a User model defined
const authenticateJWT = require('../middleware/auth'); // Correct the import

const router = express.Router();

// Get user data
router.get('/me', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from the response
        res.status(200).json(user);
    } catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
