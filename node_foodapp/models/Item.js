const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    foodtype: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
});

module.exports = mongoose.model('Item', ItemSchema);
