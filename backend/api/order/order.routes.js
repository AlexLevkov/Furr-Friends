const express = require('express')
const router = express.Router()
const { getOrders, getOrder, deleteOrder, updateOrder, addOrder } = require('./order.controller')

router.get('/', getOrders)
router.get('/:id', getOrder)
router.delete('/:id', deleteOrder)
router.put('/', updateOrder)
router.post('/', addOrder)

module.exports = router