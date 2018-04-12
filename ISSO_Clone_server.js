const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')
const bodyParser = require('body-parser')
const mongo = require('mongodb').MongoClient
var cors = require('cors')

server.listen('5432', function () { console.log('ISSO_Clone server running on 5432...') })
let ISSO_DB

mongo.connect('mongodb://localhost:27017/', (err, db) => {
  if (err) {
    console.error('Error occured in MongoDB:', err)
  } else {
    console.log('connected to mongodb...')
    ISSO_DB = db.db('ISSO_Clone_DB')
  }
})
// Middlewares
app.use('/', function (req, res, next) {
  console.log(__dirname + req.url)
  next()
})
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

// Handlers
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.post('/threadDetails', async function (req, res) {
  let art = req.body.thread
  let comments = await ISSO_DB.collection('comments').find({thread_id: parseInt(art)}).toArray()
  res.header('Content-Type', 'application/json')
  res.send(JSON.stringify(comments))
})

app.post('/saveComment', async function (req, res) {
  let data = req.body
  data.comment_id = Math.floor((Math.random() * 1000000))
  let saved = await ISSO_DB.collection('comments').insert(data)
  console.log('saved data?', data) 
  io.to(data.thread_id).emit('updateClients', data)
  res.header('Content-Type', 'application/json')
  res.send({saved:'yes'})
})
// Socket communication
io.on('connection', soc => {
  console.log('server connected to socket')
  soc.on('join room', (data) => {
    console.log('client joined:' + data.id)
    soc.join(data.id)
  })
  soc.on('clientreply', data => console.log(data))
  soc.on('newComment', data => {
    console.log('new msg on:' + data.id)
    data.commentId = Math.floor((Math.random() * 1000000))
    io.to(data.id).emit('updateClients', data)
  })
})
