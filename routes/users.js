const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Buyer = require('../models/Buyer')
const Seller = require('../models/Seller')
const passport = require('passport')

router.post('/register', async (req, res) => {
    try {
        const user_found = await User.findOne({ email: req.body.email })   
        // console.log('This is what i got from body');
        // console.log(req.body)
        const email = req.body.email
        const fname = req.body.fname
        const lname = req.body.lname
        const phone = req.body.phone
        const address = req.body.address
        const post_code = req.body.post_code
        
        // console.log(`email: ${email}\nfname: ${fname}\nlname: ${lname}\nphone: ${phone}\naddress: ${address}\npost_code: ${post_code}`);
        

        if (user_found) {
            
            req.flash('info_err', 'User already exists!')
            res.redirect('/register')
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const new_user = new User()
            new_user.email = req.body.email
            new_user.password = hashedPassword
            new_user.role = req.body.role

            // const saved_user = await new_user.save()
            // console.log(saved_user);

            if (req.body.role == 'seller') {
                // Adding Seller
                try {
                    const seller_found = await Seller.findOne({ email: req.body.email })
                
                    if (seller_found) {
                        req.flash('info_err', 'Seller already exists!')
                        res.redirect('/register')
                    } else {
                        // New Seller
                        const new_seller = new Seller()
                        new_seller.email = email
                        new_seller.fname = fname
                        new_seller.lname = lname
                        new_seller.phone = phone
                        new_seller.address = address
                        new_seller.post_code = post_code

                        const saved_seller = await new_seller.save()
                        const saved_user = await new_user.save()
                        console.log(saved_seller);

                        req.flash('info', 'Successfully Registered! Please Login Again')
                        res.redirect('/login')
                    }
                } catch (error) {
                    console.error(error);
            
                    req.flash('info', 'Something went wrong with the seller! Please try again later')
                    res.redirect('/register')
                }
                // Adding Seller end
            } else {
                // Adding Buyer
                try {
                    const buyer_found = await Buyer.findOne({ email: req.body.email })
                    console.log(buyer_found);
                
                    if (buyer_found) {
                        req.flash('info_err', 'Buyer already exists!')
                        res.redirect('/register')
                    } else {
                        // New buyer   
                        const new_buyer = new Buyer()
                        new_buyer.email = email
                        new_buyer.fname = fname
                        new_buyer.lname = lname
                        new_buyer.phone = phone
                        new_buyer.address = address
                        new_buyer.post_code = post_code

                        const saved_buyer = await new_buyer.save()
                        const saved_user = await new_user.save()
            
                        req.flash('info', 'Successfully Registered! Please Login Again')
                        res.redirect('/login')
                    }
                } catch (error) {
                    console.error(error);
            
                    req.flash('info', 'Something went wrong with the buyer! Please try again later')
                    res.redirect('/register')
                }
                // Adding Buyer end
            }
        }
    } catch (error) {
        console.error(error);
        
        req.flash('info', 'Something went wrong with the database! Please try again later')
        res.redirect('/register')
    }
})

module.exports = router