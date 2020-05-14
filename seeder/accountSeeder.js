const mongoose = require('mongoose')
const shopIncome = require('../models/shop-income')

mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const ShopIncome = [
    new shopIncome({
        unconfirmed_income: 0,
        income: 0
    })
]

var done = 0
for (let i = 0; i < shopIncome.length; i++) {
    shopIncome[i].save( function(err, results) {
        done++

        if (done == shopIncome.length) {
            exit()
        } 
    } )
}

function exit() {
    mongoose.disconnect()
}