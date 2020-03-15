const router = require('express').Router()
const Product = require('../models/Product')
const Cart = require('../models/Cart')

router.get('/add/:id', (req, res) => {
    const productId = req.params.id
    const cart = new Cart(req.session.cart ? req.session.cart : {})

    Product.findById(productId, function(err, product) {
        if(err) {
            return res.redirect('/')
        }
        cart.add(product, product.id)
        req.session.cart = cart
        console.log(req.session.cart);
        
        res.redirect('/')
    })
})

module.exports = router