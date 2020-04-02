const router = require('express').Router()
const loggedin = require('../config/local-authenticator')
const notLoggedin = require('../config/no-login')
const dateTime = require('node-datetime')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

const Product = require('../models/Product')
const Seller = require('../models/Seller')

const productController = require('../controllers/product-controller')

cloudinary.config(productController.cloudinaryOptions)

router.get('/add', loggedin, (req, res) => {
    //console.log(req.user);
    
    if (req.user) {
        if (req.user.role == 'seller') {
            res.render('product/add-products')   
        } else {
            req.flash('info_err', 'You must be a seller to access that area')
            res.redirect('/dashboard')
        }
    } else {
        req.flash('info_err', 'You must be a seller to access that area')
        res.redirect('/')
    }
})

router.post('/add', loggedin, async (req, res) => {
    const img = req.files.product_image

    // Text Inputs
    const category = req.body.category
    const title = req.body.title
    const description = req.body.description
    const price = req.body.price
    const status = req.body.status
    const inStock = req.body.inStock

    try {
        const match_product = await Product.findOne({ email: req.user.email, title: title })

        if (match_product) {
            console.log('Product Matched!');
            req.flash('info_err', 'Product already exists!')
            res.redirect('/products/add')
        } else {
            // New Product
            const uploaded = await cloudinary.uploader.upload(img.tempFilePath, { folder: 'products/' })
            console.log(uploaded);
            
            // Save New Product
            const new_product = new Product({
                email: req.user.email,
                imagePath: uploaded.url,
                image_id: uploaded.public_id,
                category: category,
                title: title,
                description: description,
                price: price,
                status: status,
                inStock: inStock
            })

            const queued_product = await new_product.save()

            console.log('New Product!');
            req.flash('info', 'Successfully Added the Product to The Verification Queue!')
            res.redirect('/products/add')
        }
    } catch (error) {
        console.log(error);
        req.flash('info_err', 'Database Error!')
        res.redirect('/products/add')
    }
})

router.get('/delete/:id', loggedin, async (req, res) => {
    const product_id = req.params.id
    const product_found = await Product.findOne({ _id: product_id })

    const public_id = product_found.image_id
    const result = await cloudinary.uploader.destroy(public_id)
    const removed_product = await Product.findOneAndDelete({ _id: product_id })
    req.flash('info', 'Product Deleted!')
    res.redirect('/products/add')
})

module.exports = router