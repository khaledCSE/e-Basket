const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    seller_address: {
        type: String,
        required: true
    },
    post_code: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('sellers', sellerSchema)