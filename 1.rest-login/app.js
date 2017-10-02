var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var schema = mongoose.Schema;

app.use(bodyParser.urlencoded({
	extended: true
}))

mongoose.connect("mongodb://localhost/login", function(err){
	if(err){
		console.log("DB Error!");
		throw err
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

app.listen(3000, function(){
	console.log("Server Running at 3000 port")
})

app.post('/login', (req, res)=>{
	User.findOne({
		id: req.param('id')
	}, (err, result)=>{
		if(err){
			console.log('/login ERR : '+err)
			throw err
		}
		if(result){
			if(result.possword == req.param('password')){
				console.log('Login : '+result.username)
				res.json({
					success: true,
					message: "Login Success"
				})
			}
			else if(result.password != req.param('password')){
				consol.log('Password Error : '+result.username);
				res.json({
					success: false,
					message: "Password Error"
				})
			}
		}
		else{
			consol.log("ID Error")
			res.json({
				success: false,
				message: "ID Error"
			})
		}
	})
})

app.post('/register', (err, result)=>{
	user = new User({
		username: req.param('username'),
		id: req.param('id'),
		password: req.param('password')
	})
	
	User.findOne({
		id:req.param('id')
	}, (err,result)=>{
		if(err){
			console.log("/register Error : "+err)
			throw err
		}
		if(result){
			res.json({
				success: false,
				message: "Already Input User"
			})
		}
		else{
			user.save((err)=>{
				if(err){
					console.log("User save Error")
					throw err
				}
				else{
					console.log(req.param('username')+"Save success")
					res.json({
						success: true,
						message: "Register Success"
					})
				}
			})
		}
	})
})

app.post('/remove', (req,res)=>{
	User.findOne({
		id:req.param('id')
	}, (err,result)=>{
		if(err){
			console.log('/remove Error')
			throw err
		}
		if(result){
			if(result.password==req.param('password')){
				user.remove({id: req.param('id')}, function(err){
					if(err){
						console.log('remove Error')
						throw err
					}
					else{
						console.log(result.username+' user remove success')
						res.json({
							success: true,
							message: "user delete success"
						})
					}
				})
			}
			else if(result.password != req.param('password')){
				console.log(result.username+' password Error')
				res.json({
					success: false,
					message: "Password Error"
				})
			}
		}
		else{
			console.log('User Not Founded')
			res.json({
				success: false,
				message: "user not founded"
			})
		}
	})
}) 
