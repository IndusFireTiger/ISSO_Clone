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
    // console.log(ISSO_DB)
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
  console.log('get route for threadDetails for :', art)
  let comments = await ISSO_DB.collection('comments').find({thread_id: parseInt(art)}).toArray()
  // console.log('data from db:', comments)
  res.header('Content-Type', 'application/json')
  // res.header('Access-Control-Allow-Origin', 'http://localhost:9000')
  res.send(JSON.stringify(comments))
//   res.sendFile(path.join(__dirname, '/index.html'))
})

app.post('/saveComment', async function (req, res) {
  let data = req.body.app_id
  let commentJSON = {'app_id': 'xyzBlog', 'thread_id': 111111, 'id': 111111, 'parent_id': null, 'content': 'new', 'msg': 'new', 'by': 'sindhu', 'user_id': null, 'time': 'Wed Apr 11 2018 16:00:48 GMT 0530 (India Standard Time)'}
  console.log('route save comment:', data)
  commentJSON = JSON.parse(commentJSON)
  let saved = await ISSO_DB.collection('comments').insert(commentJSON)
  console.log('saved?', saved)
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
