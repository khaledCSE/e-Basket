const buyerOnly = (req, res, next) => {
    if (typeof req.user == 'undefined' || req.user.role == 'buyer') {
        next()
    } else {
        req.flash('info_err', 'You Can Order or Pay Only as a Buyer or Guest')
        res.redirect('/dashboard')
    }
}

module.exports = buyerOnly