const router = require('express').Router()
const Cart = require('../models/Cart')
const productModel = require('../models/Product')

router.get('/checkout', (req, res) => {
    var cart = req.session.cart
    res.render('shop/checkout', { cart: cart })
})

router.post('/checkout', async (req, res) => {
    // List of cities
    const cities = ['BARGUNA','BARISAL','BHOLA','JHALOKATI','PATUAKHALI','PIROJPUR','BANDARBAN','BRAHMANBARIA','CHANDPUR','CHATTOGRAM', 'CHITTAGONG','CUMILLA', 'COMILLA','COX\'S BAZAR','FENI','KHAGRACHHARI','LAKSHMIPUR','NOAKHALI','RANGAMATI','DHAKA','FARIDPUR','GAZIPUR','GOPALGANJ','KISHOREGANJ','MADARIPUR','MANIKGANJ','MUNSHIGANJ','NARAYANGANJ','NARSINGDI','RAJBARI','SHARIATPUR','TANGAIL','BAGERHAT','CHUADANGA','JASHORE','JHENAIDAH','KHULNA','KUSHTIA','MAGURA','MEHERPUR','NARAIL','SATKHIRA','JAMALPUR','MYMENSINGH','NETROKONA','SHERPUR','BOGURA','JOYPURHAT','NAOGAON','NATORE','CHAPAINAWABGANJ','PABNA','RAJSHAHI','SIRAJGANJ','DINAJPUR','GAIBANDHA','KURIGRAM','LALMONIRHAT','NILPHAMARI','PANCHAGARH','RANGPUR','THAKURGAON','HABIGANJ','MOULVIBAZAR','SUNAMGANJ','SYLHET']
    var vat = 0.15, delivery_charge
    var product_cost_sum = 0
    var total_vat = 0
    var grandTotal = 0

    const fname = req.body.fname
    const lname = req.body.lname
    const email = req.body.email
    const phone = req.body.phone
    const address = req.body.address
    const city = req.body.city
    const post_code = req.body.post_code
    const delivery = req.body.delivery

    if (cities.indexOf(city.toUpperCase()) > 1) {
        console.log('city found!')
        delivery_charge = city.toUpperCase() == 'DHAKA' ? 0 : 50
        const cart = new Cart(req.session.cart ? req.session.cart : {})
        var products = cart.generateArray()
        for (let i = 0; i < products.length; i++) {
            product_cost_sum += (products[i].price + parseFloat((products[i].price * vat).toFixed(2)))
            total_vat += parseFloat((products[i].price * vat).toFixed(2))
        }
        // console.log(`Total Vat: ${total_vat}`);
        total_vat = parseFloat(total_vat.toFixed(2))
        // console.log(product_cost_sum);
        
        // res.redirect('/payments/checkout')
        grandTotal = parseFloat((product_cost_sum + delivery_charge).toFixed(2))

        try {
            for (let i = 0; i < products.length; i++) {
                var qty = products[i].qty
                var product_id = products[i].item._id
                var inStock = (await productModel.findOne({_id: product_id})).inStock
                var newStock = (inStock - qty) > 0 ? (inStock - qty) : 0
                var updated_inventory = await productModel.findOneAndUpdate(
                    { _id: product_id }, { inStock: newStock }
                )
            }

            req.session.cart = {}
            req.flash('info', 'Purchase Complete! Thanks for shopping with e-Basket')
            res.redirect('/')
        } catch (error) {
            console.log(error)
            req.flash('info_err', 'Database Error!')
            res.redirect('/')
        }
        
    } else {
        req.flash('info', 'Please Enter a City in Bangladesh or Check Spelling')
        res.redirect('/payments/checkout')
    }
})

module.exports = router