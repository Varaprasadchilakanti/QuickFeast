const express = require('express');
const Item = require('../models/Item'); // Ensure you have an Item model defined
const authenticateJWT = require('../middleware/auth'); // Correct the import

const router = express.Router();

// Get all items with filters
router.get('/', authenticateJWT, async (req, res) => {
    const { restaurantId, category, foodtype, minRating, sortPrice } = req.query;

    let filters = {};
    if (restaurantId) filters.restaurant = restaurantId;
    if (category) filters.category = category;
    if (foodtype) filters.foodtype = foodtype;
    if (minRating) filters.rating = { $gte: minRating };

    try {
        const items = await Item.find(filters).sort({ price: sortPrice === 'low' ? 1 : -1 });
        res.status(200).json(items);
    } catch (err) {
        console.error('Error retrieving items:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
