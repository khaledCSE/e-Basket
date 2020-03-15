const bcrypt = require('bcryptjs')
const User = require('../models/User')
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')

module.exports = (passport) => {
    passport.use( new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, async (req, email, password, done) => {
        try {
            const user_found = await User.findOne({ email: email })

            if (user_found) {
                const match_password = await bcrypt.compare(password, user_found.password)

                if (match_password) {
                    done(null, {
                        email: user_found.email,
                        role: user_found.role
                    })
                } else {
                    
                }
            } else {
                done(null, false)
            }
        } catch (error) {
            done(error)
        }
    }))
    
    passport.serializeUser((user, done) => { done(null, user) })
    passport.deserializeUser((user, done) => { done(null, user) })
}
