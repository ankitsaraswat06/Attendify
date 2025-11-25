const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const attendanceSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true
  },
  remarks: {
    type: String,
    default: ""
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  rollNo: {
    type: Number,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    required: true
  },
  section: {
    type: String
  },
  attendance: [attendanceSchema] // 👈 Embedded attendance records
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
