let mongoose = require("mongoose");

let studentSchema = new mongoose.Schema({
   name : {
    type:String
   },
   rollNumber : {
    type:Number,
    unique:true
   },
   image : {
    type:String
   },
   attendance:[
    {
        date_day:{
            type:String,
        },
        lectureOf:{
            type:String,
        },
        status:{
            type:String,
        }
    }
   ]
});

let Student = mongoose.model("Student",studentSchema);
module.exports = Student;