module.exports = auth

function auth(app, fs, db, multer){
    var imagenum = 0;

    var storage = multer.diskStorage({
        destination: (req,file,cb)=>{
            cb(null, 'file/')
        },
        filename: (req,file,cb)=>{
            cb(null, imagenum+'.png')
        }
    })

    var upload = multer({storage: storage})

    app.get('/auth', (req, res)=>{
        fs.readFile('auth.html', 'utf-8', (err,data)=>{
            res.send(data)
        })
    })

    app.post('/auth', upload.single('file'), (req, res)=>{
        console.log(req.file)
        var params = {
            name: req.param('name'),
            id : req.param('id'),
            password: req.param('password'),
            email: req.param('email'),
            image: req.param('image')
        }
        console.log(params)
        var data = new db.User({
            name: req.param('name'),
            id : req.param('id'),
            password: req.param('password'),
            email: req.param('email'),
            image: ''
        })

        db.User.findOne({
            image: req.file.originalname
        }, (err,result)=>{
            if(err){
                console.log('/ findOne Error!')
                throw err
            }
            else if(result){
                console.log('Already in Database')
                res.send(400, {
                    success: false,
                    message: "Already in Database"
                })
            }
            else{
                data.save(err=>{
                    if(err){
                        console.log('save Error')
                        res.send(401, {
                            success: false,
                            message: "Save Error!"
                        })
                    }
                    else{
                        console.log('image'+imagenum+' save Success')
                        imagenum++
                        res.send(200, [req.file, params])
                    }
                })
            }
        })
    })
}