const express=require("express");
const router = express.Router();


router.get("/landing",(req,res)=>{
    res.render("landing");
})


router.get("/home",(req,res)=>{
    
    if (!req.user) {
    return res.redirect("/login");
  }
  res.render("home", { user: req.user });
})

router.get("/profile",(req,res)=>{
  res.render("profile");
})



module.exports=router;