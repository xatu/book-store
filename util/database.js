const mongodb = require('mongodb')
const mongo = mongodb.MongoClient

let _db
const mongoConnect = callback => {
  mongo.connect(
    'mongodb+srv://test:1234@xatu-1rywm.mongodb.net/test?retryWrites=true&w=majority',
    { useUnifiedTopology: true }
  )
    .then(client => {
      _db = client.db()
      callback()
    })
    .catch(err => {
      console.log(err)
      throw err
    })
}

const getDb = () => {
  if (_db) {
    return _db
  }
  throw new Error('No database found!')
}

module.exports = {
  mongoConnect,
  getDb
}
