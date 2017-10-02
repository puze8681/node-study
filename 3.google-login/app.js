var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var ejs = require('ejs')
var fs = require('fs')
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
var schema = mongoose.Schema
var app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({
    secret: '`1234567890-=~!@#$%^&*()_+',
    resave: false,
    saveUninitialized: true
}))

app.use(express.static('public'))
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect("mongodb://localhost/googlelogin", err=>{
    if(err){
        console.log("DB Error!")
    }
    else{
        console.log("DB Connect Success!")
    }
})

var UserSchema = new schema({
    username: {
        type: String
    },
    id: {
        type: String
    },
    password: {
        type: String
    }
})

var User = mongoose.model('user', UserSchema)

app.listen(3000, err=>{
    if(err){
        console.log('Server Error!')
        throw err
    }
    else{
        console.log('Server Running At 3000 Port')
    }
})

app.get('/', (req, res)=>{
    res.send('login success')
})

app.post('/login', (req,res)=>{
    User.findOne({
        id: req.param('id'),
        password: req.param('password')
    }, (err,result)=>{
        if(err){
            console.log("/login Error!")
            throw err
        }
        if(result){
            console.log(result.username+" Login")
            res.json({
                success: true,
                message: "login success"
            })
        }
        else{
            res.json({
                success: false,
                message: 'account not fount'
            })
        }
    })
})

app.post('/register', (req,res)=>{
    var user = new User({
        username: req.param('username'),
        id: req.param('id'),
        password: req.param('password')
    })
    User.findOne({
        id: req.param('id')
    }, (err, result)=>{
        if(err){
            console.log('/register Error!')
            throw err
        }
        else if(result){
            res.json({
                success: false,
                message: 'already added account'
            })
        }
        else{
            user.save(err=>{
                if(err){
                    console.log("save Error")
                    throw err
                }
                else{
                    console.log(req.param('username')+" register success")
                    res.json({
                        success: true,
                        message: "account save success"
                    })
                }
            })
        }
    })
})

app.get('/gregister', (req,res)=>{
    fs.readFile('register.ejs', 'utf-8', (err, data)=>{
        res.end(ejs.render(data,{
            id: req.session.email,
            username: req.session.username
        }))
    })
})

app.post('/gregister', (req,res)=>{
    var body = req.body
    User.findOne({
        id: req.session.email
    }, (err, result)=>{
        if(err){
            console.log('/gregister Error!')
            throw err
        }
        User.update({
            username: result.username,
            id: result.id,
            password: body.password
        }, err=>{
            if(err){
                console.log('update Error!')
                throw err
            }
            else{
                console.log(result.username+' update success!')
                res.json({
                    success: true,
                    message: "Update Success!"
                })
            }
        })
    })
})

passport.serializeUser((user, done)=>{
    console.log("serialize")
    done(null, user)
})

passport.deserializeUser((user, done)=>{
    console.log("deserialize")
    done(null, user)
})

passport.use(new GoogleStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: "http://localhost/auth/google/callback",
    profileFields: ['email', 'gender', 'name']
}, (accessToken, refreshToken, profile, done)=>{
    console.log(profile)
    console.log(profile._json.emails[0].value)
    console.log(profile.displayName)
    var user = new User({
        username: profile.displayName,
        id: profile._json.email[0].value,
        password: 0
    })
    User.findOne({
        id: profile._json.email[0].value
    }, (err, result)=>{
        if(err){
            console.log('/register Error!')
            throw err
        }
        else if(result){
            console.log(displayName+" already")
            done(null, true)
        }
        else{
            user.save(err=>{
                if(err){
                    console.log("save Error")
                    throw err
                }
                else{
                    console.log(profile.displayName+" register success")
                    done(null,true)
                }
            })
        }
    })
}))

app.get('/auth/google', passport.authenticate('google', {scope:['https://www.googleapis.com/auth/userinfo.email'/*,'https://www.googleapis.com/auth/userinfo.profile'*/]}))

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req,res)=>{
    res.redirect('/gregister')
})