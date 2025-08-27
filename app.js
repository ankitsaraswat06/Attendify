let express = require("express");
let app = express();
const mongoose = require('mongoose');

const ejs = require("ejs");
const path = require("path");
const Student = require("./Schema/Student");
const route  = require("./Routes/enroll");
mongoose.connect('mongodb+srv://thegreatkk687:s38A6SoL8JAm3Rc4@cluster0.alfz8fj.mongodb.net/')
.then(()=>{console.log("DB working fine");})
.catch((e)=>{console.log(e)});


app.use(express.urlencoded({extended:true}));
app.use(route);


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.get("/getInfo/:id",async (req,res)=>{
    let id = req.params.id;
    let student = await Student.findOne({ rollNumber: id });
    if (student && student.image) {
        res.send(`<img src="data:image/jpeg;base64,${student.image}" alt="Student Image"/>`);
    } else {
        res.send("Student image not found");
    }
    res.send("Student image <img>")
});



let PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{console.log(`Server connected at PORT ${PORT}`)});