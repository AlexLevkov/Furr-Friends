const dbService = require('../../services/db.service.js')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    add,
    updateOrder
}

async function query() {
    try {
        const collestion = await dbService.getCollection('order')
        var orders = await collestion.find().toArray()
        return orders
    } catch (err) {
        logger.error('cannot find orders')
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = await collection.findOne({ '_id': ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderUd}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ '_id': ObjectId(orderId) })
    } catch {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    const orderToAdd = {
        created: order.created,
        orderBy: order.orderBy,
        orderFor: order.orderFor,
        orderOwner: order.orderOwner,

    }
    try {
        const collection = await dbService.getCollection('order')
        await collection.insertOne(orderToAdd)
        return orderToAdd
    } catch (err) {
        logger.error('cannot add order', err)
        throw err
    }
}

async function updateOrder(order) {
    try {
     
        let updatedOrder = { ...order }
        delete updatedOrder._id
        const collection = await dbService.getCollection('order')
        const orderToAdd = await collection.updateOne({ '_id': ObjectId(order._id) }, { $set: { ...updatedOrder } })
        // console.log('orderToAdd:', orderToAdd)
        return orderToAdd
    } catch (err) {
        logger.error('cannot add order', err)
        throw err
    }
}


// db.customer.updateOne({"_id":ObjectId("579c6ecab87b4b49be12664c")}, {$set:{balance: 20}})


