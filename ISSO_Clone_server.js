const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const path = require('path')
const bodyParser = require('body-parser')
const mongo = require('mongodb').MongoClient
const cors = require('cors')
const session = require('express-session')
const bcrypt = require('bcrypt')

server.listen('5432', function () { console.log('ISSO_Clone server running on 5432...') })
let ISSO_DB
let ISSO_Users
let salt = 10

mongo.connect('mongodb://localhost:27017/', (err, db) => {
  if (err) {
    console.error('Error occured in MongoDB:', err)
  } else {
    console.log('connected to mongodb...')
    ISSO_DB = db.db('ISSO_Clone_DB')
    ISSO_Users = db.db('ISSO_Clone_Users')
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
app.use(session({ secret: '1234' }))

// Handlers
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.post('/login', async function (req, res) {
  console.log('req.session:', req.session)
  let loginDetails = req.body
  console.log('loginDetails', loginDetails)
  let userDetails = await ISSO_Users.collection('users').find({ username: loginDetails.username }).toArray()
  console.log('user exists:', userDetails)
  if (loginDetails.signup) {
    console.log('attempting signup')
    if (userDetails.length >= 1) {
      res.send({ status: 'user exists' })
    } else {
      console.log('req.body.password', loginDetails.pwd)
      bcrypt.hash(loginDetails.pwd, salt, (err, hash) => {
        if (err) {
          throw err
        }
        console.log('hash', hash)
        let user = {
          username: loginDetails.username,
          pwdHash: hash
        }
        let userSigned = ISSO_Users.collection('users').insert(user)
        console.log('inserted user', userSigned)
        res.send({ status: 'inserted user' })
      })
    }
  } else {
    console.log('attempting login')

    if (userDetails.length >= 1) {
      // userDetails[0].pwd === loginDetails.pwd
      bcrypt.compare(loginDetails.pwd, userDetails[0].pwdHash, (err, result) => {
        if (err) {
          throw err
        }
        if (result) {
          // req.session.email = req.body.email
          // res.redirect('/')
          console.log('pwd matched')
        } else {
          // res.redirect('/login')
          res.send({ status: 'login failed' })
        }
      })
      // req.session.user = loginDetails.username
      res.send({ status: 'login successful' })
    } else {
      res.send({ status: 'no such user' })
    }
  }
})

app.post('/threadDetails', async function (req, res) {
  console.log(req.body)
  let art = req.body.thread
  let comments = await ISSO_DB.collection('comments').find({ thread_id: parseInt(art) }).toArray()
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
  res.send({ saved: 'yes' })
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
