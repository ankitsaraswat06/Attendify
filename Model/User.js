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
  email: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true
  },
  photo: {
    data: Buffer,          // ✅ store image as Buffer
    contentType: String    // ✅ store MIME type (e.g., 'image/jpeg')
  },
  section: {
    type: String
  },
  attendance: [attendanceSchema] // 👈 Embedded attendance records
});

// Add passport-local-mongoose plugin for authentication
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;