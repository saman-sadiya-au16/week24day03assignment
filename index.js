const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

const diskStorage = multer.diskStorage({
    destination: function(req,file,callback) {
        callback(null,path.join(__dirname,'uploads'));
    },
    filename: function name(req,file,callback) {
        const fileName = file.fieldname+'-'+Date.now()+path.extname(file.originalname);
        req.fileName = fileName;
        callback(null,fileName);
    }
});

const upload = multer({ storage: diskStorage });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname,'assets')));
app.use(express.static(path.join(__dirname,'uploads')));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

let users = [];
let todos = [];

// Show Signup form route
app.get('/', (req, res) => {
    res.render('signup.hbs');
});

// Show Signin form route
app.get('/login', (req, res) => {
    console.log(users)
    res.render('login.hbs');
});

// Show user profile route
app.get('/profile', (req, res) => {
    console.log(users);
    const data = {
        users,
        title: 'profile',
    };
    res.render('profile.hbs', data);
});

// Show todo page route
app.get('/todos', (req, res) => {
    console.log(todos)
    res.render('todo.hbs', {
        todos
    });
});

// create user
app.post('/signup', (req, res) => {
    console.log(req.body);
    const userData = {
        id: uuidv4(),
        ...req.body
    }
    users.push(userData);
    res.redirect('/login');
});

// user logged in route
app.post('/login', (req, res) => {
    console.log(req.body);
    // let isLoggedIn = false;
    const { email, password } = req.body;
    const currentUser = users.filter(user => user.email === email);
    console.log(currentUser)
    if (currentUser.length > 0) {
        const currentUserLoggedIn = currentUser.filter(user => user.password === password);
        if (currentUserLoggedIn.length > 0) {
            res.redirect('/profile');
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/')
    }
});


app.post('/profile',upload.single('profileImage'),(req,res)=> {
    console.log(req.body);
    console.log(req.fileName);
    users = users.map(user => {
        if (user.id === req.body.id) {
            user = {
                ...req.body,
                profileImage: req.fileName
            }
            return user;
        }
        return users;
    } )
    res.redirect('/profile');
});

// create todo
app.post('/todos', (req, res) => {
    console.log(req.body);
    const todoData = {
        id: uuidv4(),
        ...req.body
    }
    todos.push(todoData);
    res.redirect('/todos');
});



app.listen(port, () =>{
    console.log(`server listening to ${port}`)
})