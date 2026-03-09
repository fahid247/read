const express = require('express')
const cors = require('cors')
require('dotenv').config()

const userRoutes = require('./routes/userRoutes')
const bookRoutes = require('./routes/bookRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const wishRoutes = require('./routes/wishRoutes')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/books', bookRoutes)
app.use('/orders', orderRoutes)
app.use('/payments', paymentRoutes)
app.use('/wishlist', wishRoutes)

app.get('/', (req,res)=>{
    res.send("Read On Route Server Running")
})

app.listen(port,()=>{
    console.log(`Server running on ${port}`)
})