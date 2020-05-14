const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    cart: { type: Object, required: true },
    fname: { type: String, required: true},
    lname: { type: String, required: true},
    email: { type: String, required: true},
    phone: { type: String, required: true},
    address: { type: String, required: true},
    city: { type: String, required: true},
    post_code: { type: String, required: true},
    status: { type: String, required: true},
    totalQty: { type: Number, required: true},
    delivery: { type: String, required: true},
    grandTotal: { type: String, required: true},
    verification: { type: String, required: true}
})

module.exports = mongoose.model('Orders', orderSchema)