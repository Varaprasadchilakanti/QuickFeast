const express = require('express');
const Order = require('../models/Order'); // Ensure you have an Order model defined
const authenticateJWT = require('../middleware/auth'); // Correct the import

const router = express.Router();

// Get orders for the logged-in user
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('items.item');
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error retrieving orders:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
