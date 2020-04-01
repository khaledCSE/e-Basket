const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    email: {type: String, required: true },
    imagePath: {type: String, required: true },
    category: {type: String, required: true },
    title: {type: String, required: true },
    description: {type: String, required: true },
    price: {type: Number, required: true },
    status: {type: String, required: true},
    inStock: {type: Number, required: true }
})

module.exports = mongoose.model('products', productSchema)