let mongoose = require("mongoose");

let TeacherSchema = new mongoose.Schema({
    name : {
        type:String
    },
    id : {
        type:Number,
        unique: true,
    },
    teaches :[
        {
            section:{
                type:String,
            },
            subject:[]
        }
    ],
    phone:{
        type:Number,
    },
    email:{
        type:String
    }
});

let Teacher = mongoose.model("Teacher",TeacherSchema);
module.exports = Teacher