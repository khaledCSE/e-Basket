const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const passport = require('passport')

router.post('/register', async (req, res) => {
    try {
        const user_found = await User.findOne({ email: req.body.email })

        if (user_found) {
            res.send('user already exists!')
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const new_user = new User()
            new_user.email = req.body.email
            new_user.password = hashedPassword
            new_user.role = req.body.role

            const saved_user = await new_user.save()
            // console.log(saved_user)

            res.redirect('/login')
        }
    } catch (error) {
        res.send('db error')
    }
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/dashboard'
}), function (req, res) {
    res.send('hey')
})

module.exports = router