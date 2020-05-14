const router = require('express').Router()
const loggedin = require('../config/local-authenticator')
const notLoggedin = require('../config/no-login')
const Product = require('../models/Product')
const Seller = require('../models/Seller')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const User = require('../models/User')

router.get('/', async (req, res) => {
    const products = await Product.find({ status: 'accepted' })

    if (products.length != 0) {
        var productChunks = []
        var chunkSize = 3

        for( var i = 0; i < products.length; i += chunkSize ) {
            productChunks.push(products.slice(i, i + chunkSize))
        }   
    }
    
    res.render('shop/index', { products: productChunks })
})


router.get('/dashboard', loggedin, async (req, res) => {
    const role = req.user.role

    if (role == 'seller') {
        const user_Products = await Product.countDocuments({ email: req.user.email })
        const pending = await Product.countDocuments({ email: req.user.email, status: 'pending' })
        const products = await Product.find({ email: req.user.email })
    
        res.render('user/dashboard', {
            user: req.user,
            products: user_Products,
            pending: pending,
            product_list: products
        })   
    } else if(role == 'buyer') {
        const user = await User.findOne({ email: req.user.email })
        const orders = await Order.find({ user: user })
        orders.forEach((order) => {
            cart = new Cart(order.cart)
            order.items = cart.generateArray()
        })
        
        res.render('user/dashboard', { orders: orders })

    } else {
        const sellers = await Seller.countDocuments()
        const products = await Product.countDocuments({ status: 'accepted' })
        const pending = await Product.countDocuments({ status: 'pending' })
        const pending_products = await Product.find({ status: 'pending' })
    
        res.render('user/dashboard', {
            user: req.user,
            sellers: sellers,
            products: products,
            pending: pending,
            pending_products: pending_products
        })
    }
})

router.get('/logout', loggedin, (req, res) => {
    req.logout()
    res.redirect('/')
})

router.get('/register', notLoggedin , (req, res) => {
    res.render('user/signup-prompt')
})

router.get('/login', notLoggedin, (req, res) => {
    res.render('user/login')
})

router.get('/register/:userType', notLoggedin, (req, res) => {
    const userType = req.params.userType
    res.render('user/add-user', { userType: userType })
})

router.get('/add-admin', (req, res) => res.render('user/register'))

module.exports = router