const {orders} = require('../config/db')
const {ObjectId} = require('mongodb')
const generateTrackingId = require('../utils/trackingId')

exports.createOrder = async(req,res)=>{
 const order = req.body

 order.trackingId = generateTrackingId()

 const result = await orders.insertOne(order)

 res.send(result)
}

exports.getOrders = async(req,res)=>{
 const email=req.query.email

 const result = await orders.find({email}).toArray()

 res.send(result)
}

exports.getOrder = async(req,res)=>{
 const id=req.params.id

 const result = await orders.findOne({_id:new ObjectId(id)})

 res.send(result)
}

exports.updateOrderStatus = async(req,res)=>{
 const id=req.params.id
 const {orderStatus}=req.body

 const result = await orders.updateOne(
  {_id:new ObjectId(id)},
  {$set:{orderStatus}}
 )

 res.send(result)
}