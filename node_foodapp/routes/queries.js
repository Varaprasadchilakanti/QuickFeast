const express = require('express');
const Query = require('../models/Query'); // Ensure you have a Query model defined

const router = express.Router();

// Submit a new query
router.post('/', async (req, res) => {
    const { id, query } = req.body;

    const newQuery = new Query({ id, query });

    try {
        await newQuery.save();
        res.status(200).send('Query received successfully.');
    } catch (error) {
        console.error('Error saving query:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
