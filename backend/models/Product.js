const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: [String], // Array of image URLs or base64 strings
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    copies: {
        type: Number,
        default: 1,
    },
    contactNumber: {
        type: String,
        // Optional field if artist chooses to provide
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Product', productSchema);
