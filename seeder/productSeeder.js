const mongoose = require('mongoose')
const Product = require('../models/Product')

mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})


const Products = [
    new Product({
        email: 'sporshozaman@gmail.com',
        imagePath: 'https://www.soccerpro.com/wp-content/uploads/2018/01/s82427_adidas_nemeziz_17_3_fg_y_01.jpg',
        category: 'sports',
        title: 'ADIDAS NEMEZIZ 17',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 223.99,
        status: 'accepted',
        inStock: 6
    }),
    new Product({
        email: 'sporshozaman@gmail.com',
        imagePath: 'https://d34xpxcpbnz20f.cloudfront.net/media/catalog/product/a/d/adidas_youth_predator_19.1_firm_ground_cleats_7.jpeg',
        category: 'sports',
        title: 'ADIDAS PREDATOR 19.1 FIRM GROUND CLEATS',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 113,
        status: 'accepted',
        inStock: 6
    }),
    new Product({
        email: 'sporshozaman@gmail.com',
        imagePath: 'https://www.modells.com/dw/image/v2/BBXB_PRD/on/demandware.static/-/Sites-master-catalog/default/dw8077d80e/images/large/0000002018/F35461_700.jpg',
        category: 'sports',
        title: 'COPA 19.4 FIRM GROUND CLEATS',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 50,
        status: 'accepted',
        inStock: 6
    }),
    new Product({
        email: 'sporshozaman@gmail.com',
        imagePath: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/i1-ae0681b0-7f8d-4582-a355-cad8c7c7c7d9/mercurial-vapor-13-elite-mds-fg-firm-ground-soccer-cleat-h6qCNK.jpg',
        category: 'sports',
        title: 'Nike Mercurial Vapor 13 Elite MDS FG',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 222.97,
        status: 'accepted',
        inStock: 6
    }),
    new Product({
        email: 'sporshozaman@gmail.com',
        imagePath: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/a4baca15-6799-404c-8434-f6abc51db0e6/mercurial-superfly-7-elite-fg-firm-ground-soccer-cleat-FQXW4j.jpg',
        category: 'sports',
        title: 'Nike Mercurial Superfly 7 Elite FG',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 223.99,
        status: 'accepted',
        inStock: 6
    }),
    new Product({
        email: 'sporshozaman@gmail.com',
        imagePath: 'https://messisport-e281.kxcdn.com/29397-large_default/p4802-men-s-soccer-cleats-puma-future-51-netfit-fgag-blue-nrgy-blueblackpink.jpg',
        category: 'sports',
        title: 'Adidas Nemeziz 17',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 220,
        status: 'accepted',
        inStock: 6
    }),
    new Product({
        email: 'sporshozaman@gmail.com',
        imagePath: 'https://messisport-e281.kxcdn.com/29397-large_default/p4802-men-s-soccer-cleats-puma-future-51-netfit-fgag-blue-nrgy-blueblackpink.jpg',
        category: 'sports',
        title: 'Adidas Nemeziz 17',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 220,
        status: 'accepted',
        inStock: 0
    }),
    new Product({
        email: 'sporshozaman@gmail.com',
        imagePath: 'https://messisport-e281.kxcdn.com/29397-large_default/p4802-men-s-soccer-cleats-puma-future-51-netfit-fgag-blue-nrgy-blueblackpink.jpg',
        category: 'sports',
        title: 'Adidas Nemeziz 17',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 220,
        status: 'accepted',
        inStock: 0
    }),
    new Product({
        email: 'sporshozaman@gmail.com',
        imagePath: 'https://messisport-e281.kxcdn.com/29397-large_default/p4802-men-s-soccer-cleats-puma-future-51-netfit-fgag-blue-nrgy-blueblackpink.jpg',
        category: 'sports',
        title: 'Adidas Nemeziz 17',
        description: 'adidas Nemeziz 17+ 360 Agility FG Firm Ground Football Boots Legend Ink / Electricity / Energy Blue',
        price: 220,
        status: 'accepted',
        inStock: 0
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