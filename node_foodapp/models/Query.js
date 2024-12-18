const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
    id: { type: String, required: true },
    query: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Query', QuerySchema);
