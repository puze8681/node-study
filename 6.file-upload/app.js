var exrpess = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var multer = require('multer');
var fs = require('fs')
var app = express();
var schema = mongoose.Schema;
var stroage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, '/home/harddisk/harddisk')
    },
    filename: (req,fidle,cb)=>{
        cb(null, file.originalname)
    }
})
var upload = multer({storage: storage})

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use('/file', express.static('file'))

app.listen(3000, ()=>{
    console.log('Server Running At 3000 Port!')
})

app.get('/', (req,res)=>{
    fs.readFile('index.html', 'utf-8', (err,data)=>{
        res.send(data)
    })
})

app.get('/movieupload', (req,res)=>{
    fs.readFile('movie.html', 'utf-8', (err,data)=>{
        res.send(data)
    })
})

app.post('/moviewupload', upload.single('file'), (req,res)=>{
    console.log(req.file)
    res.send('Success')
})