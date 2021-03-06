const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
const APP_PORT = process.env.PORT

const errorController = require('./controllers/error')
const app = express()
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

const csrfProtection = csrf()

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const User = require('./models/user')

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    secret: 'my long secret text',
    resave: false,
    saveUninitialized: false,
    store
  })
)
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => console.log(err))
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404)

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    User.findOne({ email: 'test@test.com' }).then(user => {
      if (!user) {
        const user = new User({
          name: 'test',
          email: 'test@test.com',
          cart: {
            items: []
          }
        })
        user.save()
      }
    })
    app.listen(APP_PORT)
    console.log(`Server running at: http://localhost:${APP_PORT}/`)
  })
  .catch(err => {
    console.log(err)
  })
