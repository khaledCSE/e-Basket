const router = require('express').Router();
const User = require('../models/User');
const Cart = require('../models/Cart');
const productModel = require('../models/Product');
const Order = require('../models/Order');
const mail = require('../controllers/mailController');
const shopIncome = require('../models/shop-income');

const loggedIn = require('../config/local-authenticator');
const buyerOnly = require('../config/buyerOny');
const income = require('../controllers/incomeController');

router.use(buyerOnly);
router.get('/checkout', loggedIn, (req, res) => {
    var cart = req.session.cart;

    res.render('shop/checkout', { cart: cart });
});

router.post('/checkout', async (req, res) => {
    // List of cities
    const cities = [
        'BARGUNA',
        'BARISAL',
        'BHOLA',
        'JHALOKATI',
        'PATUAKHALI',
        'PIROJPUR',
        'BANDARBAN',
        'BRAHMANBARIA',
        'CHANDPUR',
        'CHATTOGRAM',
        'CHITTAGONG',
        'CUMILLA',
        'COMILLA',
        "COX'S BAZAR",
        'FENI',
        'KHAGRACHHARI',
        'LAKSHMIPUR',
        'NOAKHALI',
        'RANGAMATI',
        'DHAKA',
        'FARIDPUR',
        'GAZIPUR',
        'GOPALGANJ',
        'KISHOREGANJ',
        'MADARIPUR',
        'MANIKGANJ',
        'MUNSHIGANJ',
        'NARAYANGANJ',
        'NARSINGDI',
        'RAJBARI',
        'SHARIATPUR',
        'TANGAIL',
        'BAGERHAT',
        'CHUADANGA',
        'JASHORE',
        'JHENAIDAH',
        'KHULNA',
        'KUSHTIA',
        'MAGURA',
        'MEHERPUR',
        'NARAIL',
        'SATKHIRA',
        'JAMALPUR',
        'MYMENSINGH',
        'NETROKONA',
        'SHERPUR',
        'BOGURA',
        'JOYPURHAT',
        'NAOGAON',
        'NATORE',
        'CHAPAINAWABGANJ',
        'PABNA',
        'RAJSHAHI',
        'SIRAJGANJ',
        'DINAJPUR',
        'GAIBANDHA',
        'KURIGRAM',
        'LALMONIRHAT',
        'NILPHAMARI',
        'PANCHAGARH',
        'RANGPUR',
        'THAKURGAON',
        'HABIGANJ',
        'MOULVIBAZAR',
        'SUNAMGANJ',
        'SYLHET',
    ];
    var vat = 0.15,
        delivery_charge;
    var product_cost_sum = 0;
    var total_vat = 0;
    var grandTotal = 0;

    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const phone = req.body.phone;
    const address = req.body.address;
    const city = req.body.city;
    const post_code = req.body.post_code;
    const delivery = req.body.delivery;

    if (cities.indexOf(city.toUpperCase()) > 1) {
        console.log('city found!');
        delivery_charge = city.toUpperCase() == 'DHAKA' ? 0 : 50;
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        var products = cart.generateArray();
        for (let i = 0; i < products.length; i++) {
            product_cost_sum +=
                products[i].price +
                parseFloat((products[i].price * vat).toFixed(2));
            total_vat += parseFloat((products[i].price * vat).toFixed(2));
        }
        // console.log(`Total Vat: ${total_vat}`);
        total_vat = parseFloat(total_vat.toFixed(2));
        // console.log(product_cost_sum);

        // res.redirect('/payments/checkout')
        grandTotal = parseFloat(
            (product_cost_sum + delivery_charge).toFixed(2)
        );
        const code = mail.verifyCodeGenerator(
            6,
            'ABCDEFGHIJKLMOPQRSTUVWXYZ0123456789'
        );

        try {
            for (let i = 0; i < products.length; i++) {
                var qty = products[i].qty;
                var product_id = products[i].item._id;
                var inStock = (await productModel.findOne({ _id: product_id }))
                    .inStock;
                var newStock = inStock - qty > 0 ? inStock - qty : 0;
                var updated_inventory = await productModel.findOneAndUpdate(
                    { _id: product_id },
                    { inStock: newStock }
                );
            }

            // Save Order
            console.log(code);

            const new_order = await new Order({
                user: await User.findOne({ email: req.user.email }),
                cart: req.session.cart,
                fname: fname,
                lname: lname,
                email: email,
                phone: phone,
                address: address,
                city: city,
                post_code: post_code,
                status: 'pending',
                totalQty: req.session.cart.totalQty,
                delivery: delivery,
                grandTotal: grandTotal,
                verification: code,
            });
            const saved_order = await new_order.save();
            console.log(`Saved Code: ${saved_order.verification}`);

            // Send mail to the buyer
            const emailOptions = {
                to: saved_order.email,
                subject: 'Confirmation Code of Purchase',
                renderOptions: {
                    templatePath:
                        './views/email-templates/confirm_mail_template.ejs',
                    purpose: 'Order Details',
                    bigMSG: 'Your Order is Shipped!',
                    orderID: saved_order._id,
                    verification: saved_order.verification,
                    msg:
                        'Please Give these to the deliverer when you have received the package and paid in full.',
                },
            };
            const sent_mail = await mail.outGoingMail(emailOptions);
            // ######################################

            // Adding to Shop Income
            const shop_income = await shopIncome.find();
            console.log(shop_income);

            const updated_shop_income = await shopIncome.findByIdAndUpdate(
                shop_income[0]._id,
                { $inc: { unconfirmed_income: grandTotal } }
            );

            // Updating Seller Income
            income.updateSellerIncome(products);

            req.session.cart = {};
            req.flash(
                'info',
                'Purchase Complete! Thanks for shopping with e-Basket'
            );
            res.redirect('/');
        } catch (error) {
            console.log(error);
            req.flash('info_err', `Error was: ${error.message}`);
            res.redirect('/');
        }
    } else {
        req.flash(
            'info',
            'Please Enter a City in Bangladesh or Check Spelling'
        );
        res.redirect('/payments/checkout');
    }
});

router.get('/test', (req, res) => {
    const cart = new Cart(req.session.cart);
    const products = cart.generateArray();

    income.updateSellerIncome(products);

    res.redirect('/dashboard');
});

module.exports = router;
