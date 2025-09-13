const express=require("express");
const router=express.Router();
const User=require('../../Model/User')
const multer = require('multer');
const passport = require('passport');
const Section = require("../../Model/Section");

// configure multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads'); // folder to save uploaded photos
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });



// get the signup page route
router.get("/signup",(req,res)=>{
    res.render("signup");
})

//actually adding the user to db
router.post("/signup",upload.single('photo'), async (req, res) => { // <-- add next
    try {
        console.log(req.body); // text fields
        console.log(req.file); // file info

        const { email, password, rollNo, username, role } = req.body;
        const photo = req.file ? req.file.filename : null;

        const user = new User({ email, username, rollNo, role, photo });
        const newUser = await User.register(user, password);

        req.login(newUser, function(err) {
            if (err) return next(err);
            return res.redirect('/home');
        });
    } catch (err) {
        console.log("Signup error:", err);
        res.redirect("/login");
    }
});


// get the login page 
router.get("/login",(req,res)=>{
    res.render("login");
})


// actual login via DB
router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        
    }),
    (req, res) => {
       console.log(req.body);
        res.redirect('/home');

    }

)

router.get("/:rno/:section",async (req,res)=>{
    let {rno,section} = req.params;
    let sec = await Section.findOne({section});
    let user = await User.findOne({rollNo:rno});
    if(!sec || !user) return res.json({msg:"User or Section not found"});
    // console.log(sec,user);
    res.json({user,sec});
})

// logout
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/landing');
    });
   
})

module.exports=router;