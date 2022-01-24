const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const session = require("express-session");

app.use(session({
    secret: "It is a secret",
    resave: true,
    saveUninitialized: true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const staticPath = path.join(__dirname, 'public');
const viewsPath = path.join(__dirname, 'views');
app.use(express.static(staticPath));
app.set('view engine','ejs');
app.set('views',viewsPath);

mongoose.connect(process.env.uri, {
    useNewUrlParser: true,
	useUnifiedTopology: true
}).then( () => console.log("connection successful") )
.catch( (err) => console.log(err));

var userRouter = require('./routes/user.routes');
app.use('/',userRouter);

app.listen('8000', function(){
    console.log('Listening to port number 8000');
});