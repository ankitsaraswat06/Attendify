let express = require("express")
let route = express.Router();
const multer = require("multer");
const Student = require("../Schema/Student");

const storage = multer.memoryStorage();
const upload = multer({ storage });


route.get("/enroll",(req,res)=>{
    res.render("addStudents")
})


route.post("/info",upload.single('image'),async (req,res)=>{
    let {role,name,rollNumber,subject,email,phone} = req.body;
    if(role === 'Teacher'){
        Teacher.create({
            name,
            subject,
            email,
            phone
        })
    }
    console.log(req.body);
    res.redirect("/")
})

module.exports = route