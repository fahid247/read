const {users} = require('../config/db')

const verifyAdmin = async(req,res,next)=>{
 const email = req.decoded_email

 const user = await users.findOne({email})

 if(!user || user.role !== 'admin'){
  return res.status(403).send({message:"forbidden"})
 }

 next()
}

module.exports = verifyAdmin