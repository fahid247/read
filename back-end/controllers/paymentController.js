const stripe = require('../config/stripe')
const {payments} = require('../config/db')

exports.getPayments = async(req,res)=>{
 const email = req.query.customerEmail

 const result = await payments
  .find({customerEmail:email})
  .sort({paidAt:-1})
  .toArray()

 res.send(result)
}