const { MongoClient, ServerApiVersion } = require('mongodb')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elnmrs8.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri,{
 serverApi:{
  version:ServerApiVersion.v1,
  strict:true,
  deprecationErrors:true
 }
})

const db = client.db("read_On_Route_db")

module.exports = {
 client,
 db,
 users: db.collection("users"),
 books: db.collection("AllBooks"),
 orders: db.collection("orders"),
 payments: db.collection("payments"),
 wishes: db.collection("wish")
}