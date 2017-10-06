var exrpess = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var fs = require('fs')
var app = express()
var db = require('./mongo/database')

app.use(express.static('views'));
app.use(express.static('public'))
app.use(exrpess.static('img'))

app.use(bodyParser.urlencoded({
    extended: true
}))

require('./rotues/index')
require('./routes/auth')
require('./rotues/login')
require('./rotues/edit')
require('./rotues/profile')

require('./mongo/database')(app, fs, db, multer)

app.listen(port, err=>{
    if(err){
        console.log('Server Start Error')
    }
    else{
        console.log('Server Running At '+port+' Port!')
    }
})