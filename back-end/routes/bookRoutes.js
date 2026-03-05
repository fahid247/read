const express = require('express')
const router = express.Router()

const controller = require('../controllers/bookController')

router.get('/',controller.getBooks)

router.get('/:id',controller.getBook)

router.post('/',controller.addBook)

router.patch('/:id',controller.updateBook)

router.delete('/:id',controller.deleteBook)

module.exports = router