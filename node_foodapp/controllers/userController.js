const User = require('../models/User');

// Get details of the logged-in user
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error retrieving user details:', err);
        res.status(500).send('Internal Server Error');
    }
};
