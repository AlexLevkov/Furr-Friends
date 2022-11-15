const orderService = require('./order.service')
const logger = require('../../services/logger.service')

module.exports = {
    getOrder,
    getOrders,
    deleteOrder,
    addOrder,
    updateOrder
}

async function getOrder(req, res) {
    try {
        const order = await orderService.getById(req.params.id)
        res.send(order)
    } catch {
        logger.error('Failed to get Order', err)
        res.status(500).send({ err: 'Failed to get order' })
    }
}


async function getOrders(req, res) {
    try {
        const orders = await orderService.query()
        res.send(orders)
    } catch (err) {
        logger.error('Failed to get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function deleteOrder(req, res) {
    try {
        await orderService.remove(req.params.id)
        res.send({ msg: 'Deleted successfuly' })
    } catch (err) {
        logger.error({ err: 'Faild to delete order' })
        res.status(500).send({ err: 'Faild to delete order' })
    }
}


async function addOrder(req, res) {
    try {


        const order = req.body
        console.log('order:', order)
        const orderToAdd = await orderService.add(order)
        res.send(orderToAdd)
    } catch (err) {
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}

async function updateOrder(req, res) {
    try {
        const order = req.body
        // console.log('order:', order)
        const savedOrder = await orderService.updateOrder(order)
        res.send(savedOrder)
    } catch (err) {
        logger.error('Faild to update order', err)
        res.status(500).send({ err: 'Faild to update order' })
    }
}