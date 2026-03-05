const express = require('express')
const router = express.Router()

const controller = require('../controllers/userController')
const verifyToken = require('../middleware/verifyToken')
const verifyAdmin = require('../middleware/verifyAdmin')

router.post('/',controller.createUser)

router.get('/',verifyToken,verifyAdmin,controller.getUsers)

router.get('/:email/role',verifyToken,controller.getUserRole)

router.patch('/role/:id',verifyToken,verifyAdmin,controller.updateRole)

module.exports = router