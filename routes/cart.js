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
        if (req.session.cart.items[productId].qty > product.inStock) {
            console.log('Product Limit Exceeds!');
            req.session.cart.reduceByOne(productId)
            req.flash('info_err', 'Cannot order more products than the store has!') 
        }
        
        res.redirect('/')
    })
})

router.get('/reduce/:id', (req, res) => {
    const productId = req.params.id
    const cart = new Cart(req.session.cart ? req.session.cart : {})

    cart.reduceByOne(productId)
    req.session.cart = cart
    res.redirect('/cart/details')
})

router.get('/remove/:id', (req, res) => {
    const productId = req.params.id
    const cart = new Cart(req.session.cart ? req.session.cart : {})

    cart.removeItem(productId)
    req.session.cart = cart
    res.redirect('/cart/details')
})

router.get('/details', (req, res) => {
    // if(!req.session.cart) {
    //     res.render('shopping-cart', { products: null })
    // }

    if(!req.session.cart) {
        console.log('No Cart!');
        res.render('shop/shopping-cart', { products: null })   
    } else {
        var cart = new Cart(req.session.cart)
        const oldUrl = '/payments/checkout'
        req.session.oldUrl = oldUrl
        res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice })
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
        if (req.session.cart.items[productId].qty > product.inStock) {
            console.log('Product Limit Exceeds!');
            req.session.cart.reduceByOne(productId)
            req.flash('info_err', 'Cannot order more products than the store has!') 
        }
        
        res.redirect('/cart/details')
    })
})

module.exports = router