const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    email: { type: String, required: true },
    imagePath: { type: String, required: true },
    image_id: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    detail_info: { type: String },
    price: { type: Number, required: true },
    status: { type: String, required: true },
    inStock: { type: Number, required: true },
    comments: {
        type: [
            {
                user: { type: mongoose.Schema.Types.ObjectID },
                userName: { type: String, default: '' },
                comment: { type: String, default: '' },
                posted: { type: String, default: '' },
            },
        ],
        default: [],
    },
});

module.exports = mongoose.model('products', productSchema);
