// require("dotenv").config();
const mongoose = require("mongoose");
const Path="mongodb://localhost:27017/attendify"

mongoose.connect('mongodb://127.0.0.1:27017/attendify')  //return s promise
.then(()=>{
    console.log("MongoDb connected");
})
.catch((e)=>{
    console.log(e,"Db not connected");
})


const express=require('express');
const app=express();
const path=require('path');

// set ejs as default engine
app.set('view engine', 'ejs');

// path till public folder

// path till views folder
app.set ('views', path.join (__dirname, 'views'))


// passport and password thing-> authorization
const passport = require("passport");
const session = require("express-session");
const User = require("./Model/User");

app.use(session({
  secret: "heu5671iio90",  
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// for form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  for req.user
app.use((req, res, next) => {
  res.locals.user = req.user;  // makes "user" available in all EJS views
  next();
});
// import router
const landingRoute=require('./routes/api/landing');
const authRoute=require('./routes/api/auth');
const seedDB = require("./seedStudnet");
const seedSections = require("./seedSec");
const seedSimpleUsers = require("./seedStudnet");

// use imported routes
app.use( landingRoute);
app.use( authRoute);

//  for static files
app.use(express.static(path.join(__dirname, 'public')));


// seedSections();
// seedSimpleUsers();

app.get('/',(req,res)=>{
    res.redirect('/landing');
})

app.listen(8080,()=>{
    console.log("server started at port 8080")
})
