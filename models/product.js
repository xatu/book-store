const mongodb = require('mongodb')
const { getDb } = require('../util/database')

class Product {
  constructor (title, price, description, imageUrl, id, userId) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id ? new mongodb.ObjectId(id) : null
    this.userId = userId
  }

  save () {
    const db = getDb()
    let dbOp
    if (this._id) {
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this })
    } else {
      dbOp = db.collection('products').insertOne(this)
    }
    return dbOp
      .then((result) => {
        // console.log(result)
      })
      .catch((err) => console.log(err))
  }

  static fetchAll () {
    const db = getDb()
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        return products
      })
      .catch((err) => {
        console.log(err)
      })
  }

  static findById (productId) {
    const db = getDb()
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(productId) })
      .next()
      .then((product) => {
        return product
      })
      .catch((err) => {
        console.log(err)
      })
  }

  static deleteById (productId) {
    const db = getDb()
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(productId) })
      .then((resutl) => {
        console.log('Deleted')
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

module.exports = Product
