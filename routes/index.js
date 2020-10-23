const router = require('express').Router();
const loggedin = require('../config/local-authenticator');
const notLoggedin = require('../config/no-login');
const Product = require('../models/Product');
const Seller = require('../models/Seller');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const shopIncome = require('../models/shop-income');
const nodemailer = require('nodemailer');

router.get('/', async (req, res) => {
    if (typeof req.user == 'undefined' || req.user.role == 'buyer') {
        const products = await Product.find({ status: 'accepted' });

        if (products.length != 0) {
            var productChunks = [];
            var chunkSize = 3;

            for (var i = 0; i < products.length; i += chunkSize) {
                productChunks.push(products.slice(i, i + chunkSize));
            }
        }
        res.render('shop/index', {
            products: productChunks,
            allProducts: products,
        });
    } else {
        req.flash('info_err', 'Access Products Page with Buyer Account.');
        res.redirect('/dashboard');
    }
});

router.get('/initIncome', async (req, res) => {
    // if (typeof req.user != 'undefined' && req.user.role == 'admin') {
    //   const new_shop_income = new shopIncome({
    //     unconfirmed_income: 0,
    //     income: 0
    //   })
    //   const income_init = await new_shop_income.save()
    //   console.log(income_init);
    //   res.redirect('/dashboard')
    // } else {
    //   res.redirect('/')
    // }

    const new_shop_income = new shopIncome({
        unconfirmed_income: 0,
        income: 0,
    });
    const income_init = await new_shop_income.save();
    console.log(income_init);
    res.redirect('/dashboard');
});

router.get('/dashboard', loggedin, async (req, res) => {
    const role = req.user.role;

    if (role == 'seller') {
        const user_Products = await Product.countDocuments({
            email: req.user.email,
        });
        const pending = await Product.countDocuments({
            email: req.user.email,
            status: 'pending',
        });
        const products = await Product.find({ email: req.user.email });
        const income = (await Seller.findOne({ email: req.user.email })).income;

        return res.render('user/dashboard', {
            user: req.user,
            products: user_Products,
            pending: pending,
            product_list: products,
            income: income,
        });
    } else if (role == 'buyer') {
        const user = await User.findOne({ email: req.user.email });
        const orders = await Order.find({ user: user });
        orders.forEach((order) => {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });

        return res.render('user/dashboard', { orders: orders });
    } else {
        const sellers = await Seller.countDocuments();
        const products = await Product.countDocuments({ status: 'accepted' });
        const pending = await Product.countDocuments({ status: 'pending' });
        const pending_products = await Product.find({ status: 'pending' });
        const revenue = (await shopIncome.find())[0].income;

        return res.render('user/dashboard', {
            user: req.user,
            sellers: sellers,
            products: products,
            pending: pending,
            pending_products: pending_products,
            revenue: revenue,
        });
    }
});

router.get('/logout', loggedin, (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/register', notLoggedin, (req, res) => {
    res.render('user/signup-prompt');
});

router.get('/login', notLoggedin, (req, res) => {
    res.render('user/login');
});

router.get('/register/:userType', notLoggedin, (req, res) => {
    const userType = req.params.userType;
    res.render('user/add-user', { userType: userType });
});

router.get('/terms', notLoggedin, (req, res) => res.render('user/terms'));

router.get('/add-admin', (req, res) => res.render('user/register'));

router.get('/sendMail', async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ebasketshop.20@gmail.com',
            pass: 'e-Basket_2020',
        },
    });

    const mailOptions = {
        from: 'ebasketshop.20@gmail.com',
        to: 'sporshozaman@gmail.com',
        subject: 'Dummy Mail',
        html: '<h1 style="color: teal;">Hello World!</h1>',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    res.send(info);
});

module.exports = router;
