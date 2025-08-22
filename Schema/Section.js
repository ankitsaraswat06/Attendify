let mongoose = require("mongoose");

let sectionSchema = new mongoose.Schema({
    sec:{
        type:String,
    },
    students:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref : "Student"
        }
    ]
});

let Section = mongoose.model("Section",sectionSchema);
module.exports = Section