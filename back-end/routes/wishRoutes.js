const express = require('express')
const router = express.Router()

const controller = require('../controllers/wishController')

router.post('/',controller.addWish)

router.get('/:email',controller.getWishList)

router.delete('/:id', controller.removeWish)

module.exports = router