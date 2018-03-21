let express = require('express')
let path = require('path')
let app = express()
let bodyParser = require('body-parser')


// var jsonParser = bodyParser.json()
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(bodyParser.text())

app.use('/', function (req, res, next) {
    console.log("url:" + req.url)
    next()
})
app.use('/public', express.static('public'))

app.get('/', function (req, res) {
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
app.listen('5432', function () {
    console.log('listening on port 5432...')
})