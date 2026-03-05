const express = require('express')
const router = express.Router()

const controller = require('../controllers/orderController')

router.post('/',controller.createOrder)

router.get('/',controller.getOrders)

router.get('/:id',controller.getOrder)

router.patch('/:id',controller.updateOrderStatus)

module.exports = router