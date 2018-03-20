let express = require('express')
let path = require('path')
let app = express()

app.use('/',function(req,res,next){
    console.log("url:"+req.url)
    next()
})
app.use('/public',express.static('public'))
app.get('/', function(req, res){
    console.log("route/:"+req.url)
    res.sendFile(path.join(__dirname, '/index.html'))
})
app.all('/', function(req, res, next) {
    console.log('Accessing the secret section ...')
    next(); // pass control to the next handler
  })
app.listen('5432', function(){
    console.log('listening on port 5432...')    
})