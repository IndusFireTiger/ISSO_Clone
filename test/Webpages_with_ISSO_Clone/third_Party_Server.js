const express = require('express'),
    app = express(),
    path = require('path')

app.listen('9000', function(){console.log('third party website server on 9000...')})

//Middlewares
app.use('/', function (req, res, next) {
    console.log(__dirname+req.url)
    next()
})
app.use(express.static('public'))

//Handlers
app.get('/', function (req, res) {    
    res.send('which html...?')
})