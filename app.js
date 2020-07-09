const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const errorController = require('./controllers/error')
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
  User.findOne({ email: 'test@test.com' })
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => {
      console.log(err)
    })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoose
  .connect(
    'mongodb+srv://test:1234@xatu-1rywm.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
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
    app.listen(3000)
    console.log(`Server running at: http://localhost:3000/`)
  })
  .catch(err => {
    console.log(err)
  })
