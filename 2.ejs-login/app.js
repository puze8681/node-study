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
    fs.readFile('login.ejs', 'utf-8', (err, data)=>{
        res.send(data)
    })
})

app.post('/login', (req,res)=>{
    var body = req.body
    User.findOne({
        id: body.id
    }, (err, result)=>{
        if(err){
            console.log('/login post Error')
            throw err
        }
        if(result){
            if(result.password == body.password){
                req.session.user_id = result.id
                req.session.email = result.email
                req.session.username = result.username
                req.session.password = result.password
                console.log('Username : '+req.session.username)
                console.log('Id : '+req.session.user_id)
                console.log('Password : '+req.session.password)
                console.log('Login Success : '+result.username)
                res.redirect('/main')
            }
            else if(result.password != body.password){
                res.redirect('/')
            }
        }
        else{
            console.log("로그인 실패")
            res.redirect('/')
        }
    })
})

app.get('/insert', (req,res)=>{
    fs.readFile('insert.ejs', 'utf-8', (err,data)=>{
        res.send(data)
    })
})

app.post('/insert', (req, res)=>{
    var body = req.body
    user = new User({
        username: body.username,
        email: body.email,
        id: body.id,
        password: body,password
    })

    User.findOne({
        id: body.id
    }, (err, result)=>{
        if(err){
            console.log("/insert Error")
            throw err
        }
        if(result){
            res.redirect('/')
        }
        else {
            user.save((err) => {
                if (err) {
                    console.log("save Error")
                    throw err
                }
                else {
                    console.log(body.username + " save success")
                    res.redirect('/')
                }
            })
        }
    })
})

app.get('/delete', (req,res)=>{
    fs.readFile('remove.ejs', 'utf-8', (err,data)=>{
        res.send(data)
    })
})

app.post('delete', (req,res)=>{
    var body = req.body

    User.findOne({
        id: body.id
    }, (err, result)=>{
        if(err){
            console.log('/delete POST Error')
            throw err
        }
        if(result){
            User.remove({id: body.id}, err=>{
                if(body.password == result.password){
                    User.remove({id: result.id}, err=>{
                        if(err){
                            console.log('User Delete ERR!')
                            throw err
                        }
                        else{
                            console.log('User '+result.username+' Delte Success!')
                            req.session.destroy(()=>{
                                req.session()
                            })
                            res.redirect('/')
                        }
                    })
                }
                else if(body.password != result.password){
                    console.log('Password Error')
                    res.redirect('/')
                }
            })
        }
        else{
            res.redirect('/')
        }
    })
})

app.get('/main', (req,res)=>{
    fs.readFile('main.ejs', 'utf-8', (err, data)=>{
        res.end(ejs.render(data, {username: req.session.username}))
    })
})

app.get('/edit', (req,res)=>{
    fs.readFile('/edit.ejs', 'utf-8', (err, data)=>{
        res.end(ejs.render(data, {
            username: req.session.username,
            email: req.session.email,
            id: req.session.user_id,
            password: req.session.password
        }))
    })
})

app.post('/edit', (req,res)=>{
    var body = req.body

    user = new User({
        username: body.username,
        emai: body.email,
        id: body.id,
        password: body.password
    })
    User.remove({id: req.session.user_id}, err=>{
        if(err){
            console.log(err)
            throw err
        }
        user.save(err=>{
            if(err){
                console.log("/edit save Error")
                throw err
            }
            else{
                console.log('Edit success')
                req.session.username = body.username
                req.session.user_id = body.id
                req.session.email = body.email
                req.session.password = body.password
                res.redirect('/main')
            }
        })
    })
})

app.get('/logout', (req,res)=>{
    console.log('Logout USER : '+req.session.username)
    req.session.destroy(()=>{
        req.session
    })
    res.redirect('/')
})