const admin = require('../config/firebase')

const verifyToken = async(req,res,next)=>{
 const token = req.headers.authorization

 if(!token){
  return res.status(401).send({message:"unauthorized"})
 }

 try{
  const idToken = token.split(" ")[1]
  const decoded = await admin.auth().verifyIdToken(idToken)

  req.decoded_email = decoded.email

  next()
 }
 catch{
  res.status(401).send({message:"unauthorized"})
 }
}

module.exports = verifyToken