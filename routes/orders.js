const router = require('express').Router()
const Order = require('../models/Order')
const shopIncome = require("../models/shop-income");

router.post('/confirm',async (req, res) => {
    const order_id = req.body.order_id
    const verification = req.body.confirmation_code
    console.log(verification);
    
    
    try {
        const order_found = await Order.findById(order_id)
        if (order_found) {
            if (order_found._id == order_id && order_found.verification == verification) {
                const confirm = await Order.findByIdAndUpdate(order_id, { status: 'complete' })
                const shop_income = await shopIncome.find()
                const unconfirmed = shop_income[0].unconfirmed_income
                const actual_income = await shopIncome.findByIdAndUpdate(shop_income[0]._id, { $inc: { income: unconfirmed } })
                req.flash('info', 'Order Completed! Good Job!')
                res.redirect('/dashboard')
            } else {
                req.flash('info_err', 'Invalid Confirmation Code or ID!')
                res.redirect('/dashboard')
            }
        } else {
            req.flash('info_err', 'No Order belongs to that ID!')
            res.redirect('/dashboard')
        }
    } catch (error) {
        console.log(error);
        req.flash('info_err', 'Error Saving the Order. Please Try Again!')
        res.redirect('/dashboard')
    }
})

module.exports = router