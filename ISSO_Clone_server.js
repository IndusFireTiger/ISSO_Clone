const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    path = require('path'),
    bodyParser = require('body-parser')

server.listen('5432', function(){console.log('ISSO_Clone server running on 5432...')})

//Middlewares
// app.use(bodyParser.urlencoded())
// app.use(bodyParser.json())
// app.use(bodyParser.text())
app.use('/', function (req, res, next) {
    console.log(__dirname+req.url)
    next()
})
app.use(express.static('public'))

//Handlers
app.get('/', function (req, res) {    
    res.sendFile(path.join(__dirname, '/index.html'))
})

//Socket communication
io.on('connection', soc => {
    console.log('server connected to socket')
    soc.on('join room', (data) => {
        console.log('client joined:'+data.id)
        soc.join(data.id)
    })
    soc.on('clientreply', data => console.log(data))
    soc.on('newComment', data => {
        console.log('new msg on:'+data.id)
        data.commentId = Math.floor((Math.random() * 1000000))
        io.to(data.id).emit('updateClients', data)
    })
})