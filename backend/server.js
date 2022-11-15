const express = require('express')
const cors = require('cors')
const path = require('path')
const expressSession = require('express-session')

const app = express()
const http = require('http').createServer(app)

// Express App Config
const session = expressSession({
    secret: 'coding is amazing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})
app.use(express.json())
app.use(session)

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

const authRoutes = require('./api/auth/auth.routes')
const petRoutes = require('./api/pet/pet.routes')
const userRoutes = require('./api/user/user.routes')
const orderRoutes = require('./api/order/order.routes')
const { connectSockets } = require('./services/socket.service')

// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/pet', petRoutes)
app.use('/api/user', userRoutes)
app.use('/api/order', orderRoutes)
connectSockets(http, session)

app.use(express.static('public'));

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue/react-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})




// FIX: learning sockets

// const socket = require('socket.io')

// var io = socket(http) // the parameter inside is the server we want to work with

// io.on('connection', (socket) => {
//     console.log('made connection')
//     console.log('socket.id:', socket.id)
//     socket.on("success-msg", (data) => {
//         console.log('data:', data)
//         io.sockets.emit('success-msg', data)
//     })

//     socket.on('broadcast', (data) => {
//         console.log('data in broadcast:', data)
//         socket.broadcast.emit('test', data)
//     })

// }) //listening to "connection event" the socket is from the client

