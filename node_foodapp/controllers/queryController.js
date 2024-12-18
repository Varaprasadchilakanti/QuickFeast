const Query = require('../models/Query');

// Create a new query
exports.createQuery = async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ message: 'Query is required.' });
    }

    const newQuery = new Query({
        id: req.user.id, // Assume user ID is part of the request
        query,
    });

    try {
        await newQuery.save();
        res.status(201).json({ message: 'Query submitted successfully.' });
    } catch (err) {
        console.error('Error submitting query:', err);
        res.status(500).send('Internal Server Error');
    }
};

// Get all queries for the logged-in user
exports.getUserQueries = async (req, res) => {
    try {
        const queries = await Query.find({ id: req.user.id }); // Assuming user ID is stored in the query document
        res.status(200).json(queries);
    } catch (err) {
        console.error('Error retrieving queries:', err);
        res.status(500).send('Internal Server Error');
    }
};
