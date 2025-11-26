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

// Signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});


// Signup logic with photo upload
router.post("/signup", upload.single("photo"), async (req, res) => {
  try {
    const { email, password, rollNo, username, role, section ,course } = req.body;

    const userData = { email, username, rollNo, role, section , course };

    if (req.file) {
      userData.photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const user = new User(userData);
    await User.register(user, password);

    res.redirect("/login");
  } catch (err) {
    console.error("Signup error:", err);
    res.redirect("/signup");
  }
});

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Serve user photo directly
router.get("/:roll/photo", async (req, res) => {
  try {
    const rollNo = req.params.roll;
    const user = await User.findOne({ rollNo });

    if (!user || !user.photo) {
      return res.status(404).send("Photo not found");
    }

    res.contentType(user.photo.contentType);
    res.send(user.photo.data);
  } catch (err) {
    res.status(500).send("Error retrieving photo");
  }
});

// Show user profile (with embedded photo)
// router.get("/:roll", async (req, res) => {
//   const rollNo = req.params.roll;
//   const user = await User.findOne({ rollNo });

//   if (user) {
//     res.send(`
//       <h1>${user.username}</h1>
//       <p>Roll No: ${user.rollNo}</p>
//       ${
//         user.photo
//           ? <img src="/${user.rollNo}/photo" alt="User Photo"/>
//           : "<p>No photo uploaded</p>"
//       }
//     `);
//   } else {
//     res.send("User not found");
//   }
// });

// Actual login via DB
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const rollNo = req.user.rollNo;
      const user = await User.findOne({ rollNo });
      const sec = await Section.findOne({ section: user.section });

      if (!sec || !user) {
        return res.json({ msg: "User or Section not found" });
      }

      res.render("profile", { user, sec });
    } catch (err) {
      console.error("Error loading profile after login:", err);
      res.redirect("/home");
    }
  }
);

// Profile by rollNo + section
router.get("/:rno/:section", async (req, res) => {
  const { rno, section } = req.params;
  const sec = await Section.findOne({ section });
  const user = await User.findOne({ rollNo: rno });

  if (!sec || !user) return res.json({ msg: "User or Section not found" });

  res.render("profile", { user, sec });
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/landing");
  });
});

module.exports = router;