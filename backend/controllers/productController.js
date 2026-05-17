const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Request = require('../models/Request');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate('artist', 'name');

    // Add sold count to each product
    const productsWithSold = await Promise.all(products.map(async (p) => {
        const soldCount = await Request.countDocuments({ product: p._id, status: 'accepted' });
        return { ...p._doc, soldCount };
    }));

    res.json(productsWithSold);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('artist', 'name email');

    if (product) {
        const soldCount = await Request.countDocuments({ product: product._id, status: 'accepted' });
        res.json({ ...product._doc, soldCount });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Artist
const createProduct = asyncHandler(async (req, res) => {
    const { title, description, price, images, category, copies } = req.body;

    const product = new Product({
        title,
        description,
        price,
        images, // Now an array
        category,
        copies,
        artist: req.user._id, // Set artist to logged in user
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Get logged in user's artworks
// @route   GET /api/products/myartworks
// @access  Private
const getMyProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ artist: req.user._id });
    res.json(products);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Artist
const updateProduct = asyncHandler(async (req, res) => {
    const { title, description, price, images, category, copies } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        if (product.artist.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this artwork');
        }

        product.title = title || product.title;
        product.description = description || product.description;
        product.price = price || product.price;
        product.images = images || product.images;
        product.category = category || product.category;
        product.copies = copies || product.copies;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Artist
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        if (product.artist.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this artwork');
        }

        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    getMyProducts,
    updateProduct,
    deleteProduct,
};
