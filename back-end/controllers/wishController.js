const {wishes} = require('../config/db')

exports.addWish = async(req,res)=>{
 const wish=req.body

 const result = await wishes.insertOne(wish)

 res.send(result)
}

exports.getWishList = async(req,res)=>{
 const email=req.params.email

 const result = await wishes.find({email}).toArray()

 res.send(result)
}