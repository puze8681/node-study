var fs = require('fs')
var ejs = require('ejs')
var mongoose = require('mongoose')
var express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session')
var schema = mongoose.Schema;
var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({
    secret: '`1234567890-=~!@#$%^&*()_+',
    resave: false,
    saveUninitialized: true
}))

app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost/ejs-login-form", (err)=>{
    if(err){
        console.log("DB Error")
        throw err
    }
})

var UserSchema = new schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    id: {
        type: String
    },
    password:{
        type: String
    }
})

var MemoSchema = new schema({
    email: {
        type: String
    },
    index: {
        type: String
    }
})

var User = mongoose.model('user', UserSchema)
var Memo = mongoose.model('memo', MemoSchema)

app.listen(3000, function(){
    console.log("Server Running at 3000 Port")
})

app.get('/', (req, res)=>{
    fs.readFile('index.ejs', 'utf-8', (err,data)=>{
        res.end(ejs.render(data,{
            username: req.session.username
        }))
    })
})

app.get('/',(req,res)=>{
    fs.readFile('login.html', 'utf-8', function(err, data){
        res.send(data)
    });
});