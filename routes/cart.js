const router = require('express').Router()
const Product = require('../models/Product')
const Cart = require('../models/Cart')

const loggedin = require('../config/local-authenticator')

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

router.get('/details', (req, res) => {
    // if(!req.session.cart) {
    //     res.render('shopping-cart', { products: null })
    // }

    if(!req.session.cart) {
        console.log('No Cart!');
        res.render('shopping-cart', { products: null })   
    } else {
        var cart = new Cart(req.session.cart)
        
        res.render('shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice })
    }
})

router.get('/increase/:id', (req, res) => {
    const productId = req.params.id
    const cart = new Cart(req.session.cart ? req.session.cart : {})

    Product.findById(productId, function(err, product) {
        if(err) {
            return res.redirect('/')
        }
        cart.add(product, product.id)
        req.session.cart = cart
        console.log(req.session.cart);
        
        res.redirect('/cart/details')
    })
})

module.exports = router