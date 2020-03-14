const mongoose = require('mongoose')
const Product = require('../models/Product')

mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})


const Products = [
    new Product({
        imagePath: 'https://www.soccerpro.com/wp-content/uploads/2018/01/s82427_adidas_nemeziz_17_3_fg_y_01.jpg',
        title: 'Adidas Nemeziz 17',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 223.99
    }),
    new Product({
        imagePath: 'https://www.soccerpro.com/wp-content/uploads/2018/01/s82427_adidas_nemeziz_17_3_fg_y_01.jpg',
        title: 'Adidas Nemeziz 17',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 223.99
    }),
    new Product({
        imagePath: 'https://www.soccerpro.com/wp-content/uploads/2018/01/s82427_adidas_nemeziz_17_3_fg_y_01.jpg',
        title: 'Adidas Nemeziz 17',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 223.99
    }),
    new Product({
        imagePath: 'https://www.soccerpro.com/wp-content/uploads/2018/01/s82427_adidas_nemeziz_17_3_fg_y_01.jpg',
        title: 'Adidas Nemeziz 17',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 223.99
    }),
    new Product({
        imagePath: 'https://www.soccerpro.com/wp-content/uploads/2018/01/s82427_adidas_nemeziz_17_3_fg_y_01.jpg',
        title: 'Adidas Nemeziz 17',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 223.99
    }),
    new Product({
        imagePath: 'https://www.soccerpro.com/wp-content/uploads/2018/01/s82427_adidas_nemeziz_17_3_fg_y_01.jpg',
        title: 'Adidas Nemeziz 17',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 223.99
    })
]

var done = 0
for (let i = 0; i < Products.length; i++) {
    Products[i].save( function(err, results) {
        done++

        if (done == Products.length) {
            exit()
        } 
    } )
}

function exit() {
    mongoose.disconnect()
}