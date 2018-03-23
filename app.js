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
    console.log(__dirname+req.url)
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

app.get('/art/:docId', function (req, res) {
    let docId = req.url.split('/')[2]
    console.log('docId:'+docId)
    // res.end()
  })
//Socket communication
io.on('connection', soc => {
    console.log('server connected to socket')
    soc.emit('news', { serverSays: 'Hello Client' })
    soc.on('join room', (data) => {
        console.log('client joined:'+data.id)
        console.log('soc id:'+soc.id)
        soc.join(data.id)
    })
    soc.on('clientreply', data => console.log(data))
    soc.on('newComment', data => {
        data.commentId = Math.floor((Math.random() * 1000000))
        console.log('new msg on:'+data.id)
        io.to(data.id).emit('updateClients', data)
        console.log("got new comment on soc "+data)

    })
})