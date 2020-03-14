const router = require('express').Router()
const loggedin = require('../config/local-authenticator')
const Product = require('../models/Product')

router.get('/', async (req, res) => {
    const products = await Product.find()

    var productChunks = []
    var chunkSize = 3

    for( var i = 0; i < products.length; i += chunkSize ) {
        productChunks.push(products.slice(i, i + chunkSize))
    }
    console.log(productChunks);
    
    res.render('index', { products: productChunks })
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/dashboard', loggedin, (req, res) => {
    res.render('dashboard', { user: req.user })
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router