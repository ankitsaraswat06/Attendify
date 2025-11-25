const express=require("express");
const router=express.Router();
const User=require('../../Model/User')
const multer = require('multer');
const passport = require('passport');
const Section = require("../../Model/Section");
const path = require("path");
const fs = require("fs");

const storage = multer.memoryStorage();
const upload = multer({storage})

// get the signup page route
router.get("/signup",(req,res)=>{
    res.render("signup",{ error: null, formData: {} });
})

//actually adding the user to db
// actually adding the user to db
router.post("/signup", upload.single('photo'),  async (req, res) => {
    const { email, rollNo, username, role, section, course ,password} = req.body;


    const photoBase = req.file ? req.file.buffer.toString('base64') : null;
    const user = new User({ email, username, rollNo, role, section, course, photo : photoBase });
    await User.register(user, password);
    console.log(photoBase);
    // ✅ after successful signup, go to login page
    res.redirect("/login");
})

router.get("/photo/:id", async (req, res) => {
    try {
        let id = Number(req.params.id);
        // Use findOne instead of find (find returns an array)
        let user = await User.findOne({ rollNo: id });

        if (!user || !user.photo) {
            return res.status(404).send("Photo not found");
        }
        console.log(user.photo)
        res.send(`<img src="data:image/jpeg;base64,${user.photo}" alt="User Photo"/>`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


// get the login page 
router.get("/login",(req,res)=>{
    res.render("login");
})


router.get("/img/:rollNo", async (req, res) => {
  const user = await User.findOne({ rollNo: req.params.rollNo });
  if (!user || !user.photo) return res.status(404).send("Photo not found");
  // photo is a URL path like /uploads/filename -> just redirect to it
  return res.redirect(user.photo);
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