const router = require('express').Router()
const loggedin = require('../config/local-authenticator')
const notLoggedin = require('../config/no-login')

router.get('/add', (req, res) => {
    if (req.user.role == 'seller') {
        res.render('product/add-products')   
    } else {
        req.flash('info_err', 'You must be a seller to access that area')
        res.redirect('/dashboard')
    }
})

router.post('/add', (req, res) => {
    console.log(req.body);
    res.redirect('/dashboard')
})

module.exports = router