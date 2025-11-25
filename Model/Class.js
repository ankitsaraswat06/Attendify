const mongoose=require("mongoose");

const classSchema=new mongoose.Schema({
    subCode:{
        type:String,
        required:true,
        trim:true
    },
    subName:{
        type:String,
        required:true,
        trim:true
    },
    teacherName:{
        type:String,
        required:true,
        trim:true
    },
    teacher_photo:{
        type:String,
        trim:true
    }


});
// model
const Class=mongoose.model('Class',classSchema);

module.exports=Class;