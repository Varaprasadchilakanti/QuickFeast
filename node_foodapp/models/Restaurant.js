const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    cuisine: { type: String, required: true },
    isVegOnly: { type: Boolean, required: true },
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
