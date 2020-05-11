const router = require('express').Router()

router.post('/confirm', (req, res) => {
    console.log(req.body)
    res.redirect('/')
})

module.exports = router