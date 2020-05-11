const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash')
const ejsLayout = require('express-ejs-layouts')
const path = require('path')
const MongoStore = require('connect-mongo')(session)
var upload = require('express-fileupload')

const app = express()

require('./config/passport-local-config')(passport)

mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(ejsLayout)
app.set('layout', 'layouts/layout')

app.set("layout extractStyles", true)
app.set("layout extractScripts", true)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'oursecret',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))
app.use(upload({
    limits: { fileSize: 10 * 1024 * 1024 },
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))

app.use((req, res, next) => {
    res.locals.login = req.isAuthenticated()
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/users', require('./routes/users'))
app.use('/products', require('./routes/products'))
app.use('/cart', require('./routes/cart'))
app.use('/payments', require('./routes/payments'))
app.use('/orders', require('./routes/orders'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on http://localhost:${port}`))
