const mongoose = require('mongoose')

const shopIncomeSchema = new mongoose.Schema({
    unconfirmed_income: {
        type: Number,
        required: true
    },
    income: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('shopIncome', shopIncomeSchema)