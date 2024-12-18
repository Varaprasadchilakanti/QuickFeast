const Order = require('../models/Order');

// Get orders for the logged-in user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('items.item');
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error retrieving orders:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Additional functions for order management can be added here
