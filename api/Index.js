const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Post = require('./models/Post')
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const app = express();
app.use(express.urlencoded({ extended: true} ));
const fs = require('fs');

//  mongodb+srv://blog:SFVtfQLPTn42QPvn@cluster0.mkq6vuf.mongodb.net/?retryWrites=true&w=majority
// SFVtfQLPTn42QPvn
mongoose.set('strictQuery', true);
const salt = bcrypt.genSaltSync(10);
const secret = 'asg45hej7jhj56';
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
mongoose.connect('mongodb+srv://blog:SFVtfQLPTn42QPvn@cluster0.mkq6vuf.mongodb.net/?retryWrites=true&w=majority')
app.get('/test', (req,res) => {
    res.json('test ok')
});
app.post('/register', async(req,res) => {
    const {username, password} = req.body;
    // const userDoc= await User.create({username, password});
    const userDoc = new User({
        username: username,
        password: bcrypt.hashSync(password,salt)
    })
    userDoc.save()
    .then(res.json(userDoc))
    .catch((e)=>{
        console.log(e);
        console.log("Error ----------------------------------------");
        res.status(400).json(e)
    })
    
});
app.post('/login', async(req,res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username,
            });
        });       
    }else{
        res.status(400).json('Wrong credentials');
    }    
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if(err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok'); 
});

app.post('/post', uploadMiddleware.single('file'), async(req,res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async(err,info) => {
        if(err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = new Post({
        title: title,
        summary: summary,
        content: content,
        cover: newPath,
        author: info.id, 
    });
    postDoc.save()
    .then(res.json(postDoc))
    });
});

app.put('/post', uploadMiddleware.single('file'), async(req,res) => {
    let newPath = null;
    if(req.file){
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);

    }
        const {token} = req.cookies;
        jwt.verify(token, secret, {}, async(err,info) => {
            if(err) throw err;
            const {id,title, summary, content} = req.body;
            const postDoc = await Post.findById(id);
            const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
            if (!isAuthor) {
                return res.status(400).json('You are not the author');
            }
            await postDoc.update({
                title,
                summary,
                content,
                cover: newPath ? newPath : postDoc.cover,
            }); 
            res.json(postDoc);    
    
    });
    
});

app.get('/post', async(req,res) => {
    res.json(
    await Post.find()
    .populate('author', ['username'])
    .sort({createdAt: -1})
    .limit(20)
    );
});

app.post('/yourposts', async(req,res) => {
    const {userid} = req.body
    console.log(req.body)
    const postDoc = await Post.findOne({author: req.body.userid}).populate('author', ['username']);
    res.json(postDoc);
})

app.get('/post/:id', async (req,res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);    
    console.log(postDoc)
    res.json(postDoc);
})


app.listen(4000);

// app.post("/register", function(req, res){
// const newUser = new User({
//     email: req.body.username,
//     password: req.body.password
//     });
//     newUser.save(function(err){
//       if (err) {
//         console.log(err);
//       } else {
//         res.render("secrets");
//      }
//    });
//   });