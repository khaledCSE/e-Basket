const Seller = require('../models/Seller')
const Cart = require('../models/Cart')
const Order = require('../models/Order')

const updateSellerIncome = (products) => {
  // Find All Sellers
  var sellers = [];
  for (var i = 0; i < products.length; i++) {
    sellers.push(products[i].item.email);
  }
  // Unique Sellers
  const unique = [...new Set(sellers)];
  console.log(unique);

  // Finding sellers products
  unique.forEach((x) => {
    products.forEach( async (product) => {
      if (product.item.email == x) {
        const saved = await Seller.findOneAndUpdate(x, { $inc: { unconfirmed_income: product.price } })
      }
    });
  });
};

const sellerActualIncome = async (order_id) => {
    const cart = new Cart((await Order.findById(order_id)).cart)
    var products = cart.generateArray()

    // Find All Sellers
  var sellers = [];
  for (var i = 0; i < products.length; i++) {
    sellers.push(products[i].item.email);
  }
  // Unique Sellers
  const unique = [...new Set(sellers)];

  // Seller Income
  // Finding sellers products
  unique.forEach( async (x) => {
    const unc = (await Seller.findOne(x)).unconfirmed_income
    const saved = await Seller.findOneAndUpdate(x, { $inc: { income: unc } })
  });
}
module.exports = {
  updateSellerIncome: updateSellerIncome,
  sellerActualIncome: sellerActualIncome
};
