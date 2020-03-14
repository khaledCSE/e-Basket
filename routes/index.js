const router = require('express').Router()
const loggedin = require('../config/local-authenticator')

router.get('/', (req, res) => {
    res.render('index')
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