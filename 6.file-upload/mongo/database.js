var mongoose = require('mongoose')
var DB_NAME = "fileupload"
var db = mongoose.connect('mongodb://localhost/'+DB_NAME, err=>{
    if(err){
        console.log('DB Error!')
        throw err
    }
    else{
        console.log('DB Connect Success')
    }
})

var UserSchema = mongoose.Schema({
    user_name: {type: String},
    user_id : {type: String},
    user_password: {type: String},
    user_email: {type: String},
    user_image: {type: String}
})

User = mongoose.model('user', UserSchema)

exports.User = User