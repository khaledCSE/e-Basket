const router = require('express').Router();
const loggedin = require('../config/local-authenticator');
const notLoggedin = require('../config/no-login');
const dateTime = require('node-datetime');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const Product = require('../models/Product');
const Seller = require('../models/Seller');
const Buyer = require('../models/Buyer');

const productController = require('../controllers/product-controller');

cloudinary.config(productController.cloudinaryOptions);

router.get('/', async (req, res) => {
    const products = await Product.find();
    res.render('product/all_products', { products: products });
});

router.get('/add', loggedin, (req, res) => {
    //console.log(req.user);

    if (req.user) {
        if (req.user.role == 'seller' || req.user.role == 'admin') {
            res.render('product/add-products');
        } else {
            req.flash('info_err', 'You must be a seller to access that area');
            res.redirect('/dashboard');
        }
    } else {
        req.flash('info_err', 'You must be a seller to access that area');
        res.redirect('/');
    }
});

router.post('/add', loggedin, async (req, res) => {
    const img = req.files.product_image;

    // Text Inputs
    const category = req.body.category;
    const title = req.body.title;
    const description = req.body.description;
    const detail_info = req.body.detail_info;
    const price = req.body.price;
    const status = req.body.status;
    const inStock = req.body.inStock;

    try {
        const match_product = await Product.findOne({
            email: req.user.email,
            title: title,
        });

        if (match_product) {
            console.log('Product Matched!');
            req.flash('info_err', 'Product already exists!');
            res.redirect('/products/add');
        } else {
            // New Product
            const uploaded = await cloudinary.uploader.upload(
                img.tempFilePath,
                { folder: 'products/' }
            );
            console.log(uploaded);

            // Save New Product
            const new_product = new Product({
                email: req.user.email,
                imagePath: uploaded.url,
                image_id: uploaded.public_id,
                category: category,
                title: title,
                description: description,
                detail_info,
                price: price,
                status: status,
                inStock: inStock,
            });

            const queued_product = await new_product.save();

            console.log('New Product!');
            req.flash(
                'info',
                'Successfully Added the Product to The Verification Queue!'
            );
            res.redirect('/products/add');
        }
    } catch (error) {
        console.log(error);
        req.flash('info_err', 'Database Error!');
        res.redirect('/products/add');
    }
});

router.get('/confirm/:id', loggedin, async (req, res) => {
    if (req.user.role == 'admin') {
        const product_id = req.params.id;
        const updated = await Product.findOneAndUpdate(
            { _id: product_id },
            { status: 'accepted' }
        );

        req.flash('info', 'Added the product!');
        res.redirect('/dashboard');
    } else {
        req.flash('info_err', 'Only an admin can confirm a product!');
        res.redirect('/dashboard');
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
        const seller = await Seller.findOne({ email: product.email });
        const oldUrl = `/products/${id}`;
        req.session.oldUrl = oldUrl;

        res.render('product/single-product', { product, seller });
    } catch (error) {
        console.log(error.message);
        req.flash('info_err', 'Database Error');
        res.redirect('/');
    }
});

router.post('/comments/add', loggedin, async (req, res) => {
    const { id, comment } = req.body;
    try {
        const user_email = req.user.email;
        const buyer = await Buyer.findOne({ email: user_email });
        const userName = `${buyer.fname} ${buyer.lname}`;

        const product = await Product.findById(id);
        const comments_found = product.comments;
        const date = new Date();
        const months_arr = [
            '',
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const day = date.getDate();
        const month = months_arr[date.getMonth()];
        const year = date.getFullYear();
        const date_today = `${day} ${month}, ${year}`;
        const updated_comments = [
            ...comments_found,
            {
                user: buyer.email,
                userName,
                comment,
                posted: date_today,
            },
        ];
        const updated = await Product.findByIdAndUpdate(id, {
            comments: updated_comments,
        });
        req.flash('info', 'Thanks for your valuable comment.');
        res.redirect(`/products/${id}`);
    } catch (error) {
        console.log(error.message);
        req.flash('info_err', 'Database Error');
        res.redirect('/');
    }
});

router.get(
    '/comments/delete/:productID/:commentID',
    loggedin,
    async (req, res, next) => {
        const { productID, commentID } = req.params;

        try {
            const product = await Product.findById(productID);
            const comments = product.comments;
            const reduced = comments.filter(
                (comment) => comment._id != commentID
            );
            const updated = await Product.findByIdAndUpdate(productID, {
                comments: reduced,
            });
            req.flash('info', 'Your comment has been removed.');
            res.redirect(`/products/${productID}`);
        } catch (error) {
            console.error(error);
            req.flash('info_err', 'Database Error');
            res.redirect('/');
        }
    }
);

router.get('/delete/:id', loggedin, async (req, res) => {
    const product_id = req.params.id;
    const product_found = await Product.findOne({ _id: product_id });

    const public_id = product_found.image_id;
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        const removed_product = await Product.findOneAndDelete({
            _id: product_id,
        });
        req.flash('info', 'Product Deleted!');
        res.redirect('/products/add');
    } catch (error) {
        console.log(error);
        req.flash(error);
        res.redirect('/products/add');
    }
});

module.exports = router;
