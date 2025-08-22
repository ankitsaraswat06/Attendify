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
    let {name,rollNumber} = req.body;
    console.log(req.file)
    console.log(req.body);
    const photoBase = req.file ? req.file.buffer.toString('base64') : null;
    await Student.create({
        name,
        rollNumber,
        image : photoBase
    })
    res.redirect("/")
})

module.exports = route