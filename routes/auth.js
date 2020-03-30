const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const passport = require('passport')

router.post('/register', async (req, res) => {
    try {
        const user_found = await User.findOne({ email: req.body.email })

        if (user_found) {
            req.flash('info', 'User already exists!')
            res.redirect('/register')
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const new_user = new User()
            new_user.email = req.body.email
            new_user.password = hashedPassword
            new_user.role = req.body.role

            const saved_user = await new_user.save()
            // console.log(saved_user)
            req.flash('info', 'Successfully Registered! Please Login Again')
            res.redirect('/login')
        }
    } catch (error) {
        req.flash('info', 'Something went wrong with the database! Please try again later')
        res.redirect('/register')
    }
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/dashboard'
}), function (req, res) {
    res.send('hey')
})

module.exports = router