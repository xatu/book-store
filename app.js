const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const errorController = require('./controllers/error')
const { mongoConnect } = require('./util/database')
const app = express()

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const User = require('./models/user')

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findById('5de9e32e1c9d4400002b8dda')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id)
      next()
    })
    .catch(err => {
      console.log(err)
    })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoConnect(() => {
  app.listen(3000)
})
