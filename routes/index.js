const router = require('express').Router()
const loggedin = require('../config/local-authenticator')
const notLoggedin = require('../config/no-login')
const Product = require('../models/Product')

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

router.get('/login', (req, res) => {
    res.render('user/login')
})

router.get('/dashboard', loggedin, (req, res) => {
    res.render('user/dashboard', { user: req.user })
})

router.get('/logout', loggedin, (req, res) => {
    req.logout()
    res.redirect('/')
})

router.get('/register', notLoggedin , (req, res) => {
    res.render('user/signup-prompt')
})

router.get('/register/:userType', notLoggedin, (req, res) => {
    const userType = req.params.userType
    res.render('user/add-user', { userType: userType })
})

module.exports = router