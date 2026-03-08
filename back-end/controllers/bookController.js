const {books,users} = require('../config/db')
const {ObjectId} = require('mongodb')

exports.getBooks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;

    const result = await books
      .find()
      .limit(limit)
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch books" });
  }
};

exports.getBook = async(req,res)=>{
 const id=req.params.id
 const result= await books.findOne({_id:new ObjectId(id)})

 res.send(result)
}

exports.addBook = async(req,res)=>{
 const book=req.body
 const result= await books.insertOne(book)

 res.send(result)
}

exports.updateBook = async(req,res)=>{
 const id=req.params.id
 const book=req.body

 const result = await books.updateOne(
  {_id:new ObjectId(id)},
  {$set:book}
 )

 res.send(result)
}

exports.deleteBook = async(req,res)=>{
 const id=req.params.id

 const result = await books.deleteOne(
  {_id:new ObjectId(id)}
 )

 res.send(result)
}