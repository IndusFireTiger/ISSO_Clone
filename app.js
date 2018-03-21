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
    console.log("url:" + req.url)
    next()
})
app.use('/id/public', express.static('public'))

//Handlers
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})
app.get('/id/:id', function (req, res) {
    console.log(req.params.id)
    res.sendFile(path.join(__dirname, '/index.html'))
})
app.post('/addNewComment', function (req, res) {
    console.log('request to add new comment')
    console.log(req.body)
    // res.send(200)
    // res.setHeader('Content-Type', 'application/json')
    // res.send(JSON.stringify({
    //     comment: req.body.comment
    // }))
})

//Socket communication
io.on('connection', soc => {
    console.log('server connected to socket')
    soc.emit('news', { serverSays: 'Hello Client' })
    soc.on('my other event', data => console.log(data))
    soc.on('newComment', data => {
        io.sockets.emit('updateClients', data)
        console.log("got new comment on soc "+data)
    })
})

// app.listen('5432', function () {
//     console.log('listening on port 5432...')
// })