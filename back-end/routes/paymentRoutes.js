const express = require('express')
const router = express.Router()

const controller = require('../controllers/paymentController')

router.get('/',controller.getPayments)

router.post('/create-checkout-session',controller.createCheckoutSession)

router.patch('/payment-success',controller.paymentSuccess)

module.exports = router