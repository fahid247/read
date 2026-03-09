const {orders} = require('../config/db')
const {ObjectId} = require('mongodb')
const generateTrackingId = require('../utils/trackingId')

exports.createOrder = async(req, res)=>{
    try {
        const order = req.body;
        order.trackingId = generateTrackingId();
        order.createdAt = new Date(); // Add timestamp
        
        const result = await orders.insertOne(order);
        
        // Get the inserted document
        const insertedOrder = await orders.findOne({ _id: result.insertedId });
        
        res.status(201).json(insertedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
}

exports.getOrders = async(req,res)=>{
 const email=req.query.email

 const result = await orders.find({email}).toArray()

 res.send(result)
}

exports.getOrder = async(req, res)=>{
    try {
        const id = req.params.id;
        console.log('Getting order with ID:', id); // Debug log
        
        // Check if ID is valid
        if (!ObjectId.isValid(id)) {
            console.log('Invalid ObjectId format:', id);
            return res.status(400).json({ message: 'Invalid order ID format' });
        }
        
        const result = await orders.findOne({ _id: new ObjectId(id) });
        console.log('Found order:', result); // Debug log
        
        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json(result);
    } catch (error) {
        console.error('Error in getOrder:', error);
        res.status(500).json({ message: 'Failed to fetch order' });
    }
};

exports.updateOrderStatus = async(req,res)=>{
 const id=req.params.id
 const {orderStatus}=req.body

 const result = await orders.updateOne(
  {_id:new ObjectId(id)},
  {$set:{orderStatus}}
 )

 res.send(result)
}