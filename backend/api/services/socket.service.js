const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null

function connectSockets(http, session) {
    gIo = require('socket.io')(http);
    gIo.on('connection', socket => {
        console.log('New socket', socket.id)

        socket.on('order-msg', (data) => {
            console.log('data:', data)
            emitTo({ type: data.type })
        })

        socket.on('disconnect', socket => {
            // console.log('Someone disconnected')
        })
        socket.on('chat topic', topic => {
            if (socket.myTopic === topic) return;
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic
        })
        socket.on('chat newMsg', msg => {
            // emits to all sockets:
            // gIo.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            gIo.to(socket.myTopic).emit('chat addMsg', msg)
        })
        socket.on('orderAdded', order => {
            const orderPass = {
                type: 'newOrder',
                data: order,
                userId: order.orderOwner._id
            }
            emitToUser(orderPass)
        })
        socket.on('order approved', pet => {
            // console.log('pet', pet);
            const orderApprove = {
                type: 'newOrder',
                data: pet,
                userId: pet.owner._id
            }
            emitToUser(orderApprove)

            const userMsg = {
                type: 'user msg',
                data: 'Your request for: ' + pet.name + ' adoption has been approved!',
                userId: pet.owner._id
            }
            emitToUser(userMsg)

            const userMsg2 = {
                type: 'special',
                data: 'Your request for: ' + pet.name + ' adoption has been approved!',
                userId: pet.owner._id
            }

            setTimeout(() => {
                emitToUser(userMsg2)

            }, 1000);


            // socket.emit()
            // gIo.emit('order approved')
        })
        socket.on('user-watch', userId => {
            socket.join('watching:' + userId)
        })
        socket.on('set-user-socket', userId => {
            logger.debug(`Setting socket.userId = ${userId}`)
            socket.userId = userId
        })
        socket.on('login', userId => {
            logger.debug(`Setting socket.userId = ${userId}`)
            socket.userId = userId
        })
        socket.on('unset-user-socket', () => {
            delete socket.userId
        })
        // socket.on('order room', room => {
        //     if (socket.myRoom === room) return;
        //     socket.join(room)
        //     socket.myRoom = room
        // })      
    })
}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label).emit(type, data)
    else gIo.emit(type, data)
}

function emitToUser({ type, data, userId }) {
    logger.debug('Emiting to user socket: ' + userId)
    const socket = _getUserSocket(userId)
    if (socket) socket.emit(type, data)
    else {
        console.log('User socket not found');
        _printSockets();
    }
}

// Send to all sockets BUT not the current socket 
function broadcast({ type, data, room = null, userId }) {
    const excludedSocket = _getUserSocket(userId)
    if (!excludedSocket) {
        logger.debug('Shouldnt happen, socket not found')
        _printSockets();
        return;
    }
    logger.debug('broadcast to all but user: ', userId)
    if (room) {
        excludedSocket.broadcast.to(room).emit(type, data)
    } else {
        excludedSocket.broadcast.emit(type, data)
    }
}

function _getUserSocket(userId) {
    const sockets = _getAllSockets();
    const socket = sockets.find(s => s.userId == userId)
    return socket;
}

function _getAllSockets() {
    const socketIds = Object.keys(gIo.sockets.sockets)
    console.log('socketIds:', socketIds)
    const sockets = socketIds.map(socketId => gIo.sockets.sockets[socketId])
    // console.log('sockets:', sockets)
    return sockets;
}

function _printSockets() {
    const sockets = _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}

function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

module.exports = {
    connectSockets,
    emitTo,
    emitToUser,
    broadcast,
}



