const { wishes } = require('../config/db')
const { ObjectId } = require('mongodb')

exports.addWish = async (req, res) => {
  const wish = req.body

  const result = await wishes.insertOne(wish)

  res.send(result)
}

exports.getWishList = async (req, res) => {
  const email = req.params.email

  const result = await wishes.find({ email }).toArray()

  res.send(result)
}

exports.removeWish = async (req, res) => {
  const id = req.params.id

  const result = await wishes.deleteOne({
    _id: new ObjectId(id)
  })

  res.send(result)
}