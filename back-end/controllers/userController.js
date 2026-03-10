const {users} = require('../config/db')
const {ObjectId} = require('mongodb')

exports.createUser = async(req,res)=>{
 const user = req.body

 user.role="user"
 user.createdAt=new Date()

 const exists = await users.findOne({email:user.email})

 if(exists){
  return res.send({message:"user exists"})
 }

 const result = await users.insertOne(user)

 res.send(result)
}

exports.getUser = async (req, res) => {
  try {
    const email = req.params.email;

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to get user",
    });
  }
};

exports.getUsers = async(req,res)=>{
 const result = await users.find().toArray()
 res.send(result)
}

exports.getUserRole = async(req,res)=>{
 const email = req.params.email
 const user = await users.findOne({email})

 res.send({role:user?.role || 'user'})
}

exports.updateRole = async(req,res)=>{
 const id = req.params.id
 const {role} = req.body

 const result = await users.updateOne(
  {_id:new ObjectId(id)},
  {$set:{role}}
 )

 res.send(result)
}

exports.updateProfile = async (req, res) => {
  try {
    const email = req.params.email
    const updatedData = req.body

    const query = { email }

    const updateDoc = {
      $set: {
        displayName: updatedData.name,
        phone: updatedData.phone,
        address: updatedData.address,
        bio: updatedData.bio,
        website: updatedData.website,
        location: updatedData.location,
        photoURL: updatedData.photoURL,
        social: updatedData.social,
        preferences: updatedData.preferences,
        updatedAt: new Date()
      }
    }

    const result = await users.updateOne(query, updateDoc)

    res.send({
      success: true,
      message: "Profile updated successfully",
      result
    })

  } catch (error) {
    console.error(error)
    res.status(500).send({
      success: false,
      error: "Failed to update profile"
    })
  }
}