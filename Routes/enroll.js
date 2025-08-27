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
    });
    
    res.redirect("/")
})

route.get("/:roll",async(req,res)=>{
    let rollNumber = req.params.roll;
    let student = await Student.findOne({ rollNumber });
    if (student && student.image) {
        res.send(`<img src="data:image/jpeg;base64,${student.image}" alt="Student Image"/>`);
    } else {
        res.send("Student image not found");
    }
})

module.exports = route