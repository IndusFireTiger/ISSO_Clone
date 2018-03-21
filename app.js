const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    path = require('path'),
    bodyParser = require('body-parser')

server.listen('5432')
//Middlewares
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use('/', function (req, res, next) {
    console.log('accessing:'+__dirname+req.url)
    next()
})
app.use('/public', express.static('public'))

//Handlers
app.get('/', function (req, res) {    
    res.sendFile(path.join(__dirname, '/index.html'))
})
app.post('/addNewComment', function (req, res) {
    console.log('request to add new comment')
    console.log(req.body)
})

//Socket communication
io.on('connection', soc => {
    console.log('server connected to socket')
    soc.emit('news', { serverSays: 'Hello Client' })
    soc.on('clientreply', data => console.log(data))
    soc.on('newComment', data => {
        data.commentId = Math.floor((Math.random() * 1000000))
        io.sockets.emit('updateClients', data)
        console.log("got new comment on soc "+data)

    })
})