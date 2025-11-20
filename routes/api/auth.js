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
// actually adding the user to db
router.post("/signup", upload.single('photo'), async (req, res) => {
    try {
        console.log(req.body); // text fields
        console.log(req.file); // file info

        const { email, password, rollNo, username, role, section } = req.body;
        // const photo = req.file ? req.file.filename : null;

        const photo = req.file ? "/uploads/" + req.file.filename : null;

        const user = new User({ email, username, rollNo, role, section, photo });
        await User.register(user, password);

        // ✅ after successful signup, go to login page
        res.redirect("/login");
    } catch (err) {
        console.log("Signup error:", err);
        res.redirect("/signup"); // back to signup if error
    }
});



// get the login page 
router.get("/login",(req,res)=>{
    res.render("login");
})


router.get("/img/:rollNo", async (req, res) => {
  const user = await User.findOne({ rollNo: req.params.rollNo });
  if (!user || !user.photo) return res.status(404).send("Photo not found");
  res.set("Content-Type", user.photo.contentType);
  res.send(user.photo.data);
// res.json({user});
});


// actual login via DB
router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
    }),
    async (req, res) => {
        try {
            console.log("Logged in user:", req.user);

            // get rollNo from logged-in user
            const rollNo = req.user.rollNo;
            const user = await User.findOne({ rollNo });

            // find section for this user
            const sec = await Section.findOne({ section: user.section }); 
            // assuming you store section in user OR you can decide how to map rollNo -> section

            if (!sec || !user) {
                return res.json({ msg: "User or Section not found" });
            }

            // render profile with timetable
            res.render("profile", { user, sec });
        } catch (err) {
            console.error("Error loading profile after login:", err);
            res.redirect("/home");
        }
    }
);



router.get("/:rno/:section",async (req,res)=>{
    let {rno,section} = req.params;
    let sec = await Section.findOne({section});
    let user = await User.findOne({rollNo:rno});
    if(!sec || !user) return res.json({msg:"User or Section not found"});
    console.log(sec.timetable,user)
    // res.json({sec,user});
    res.render("profile",{user,sec});
})

// logout
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/landing');
    });
   
})

module.exports=router;