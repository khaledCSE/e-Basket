const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash')
const ejsLayout = require('express-ejs-layouts')
const path = require('path')

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
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'oursecret',
    saveUninitialized: false,
    resave: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on http://localhost:${port}`))