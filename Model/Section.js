const mongoose = require("mongoose");

const timetableEntrySchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject", // Assuming you have a Subject model
    },
  ],
  timetable: {
    Monday: [timetableEntrySchema],
    Tuesday: [timetableEntrySchema],
    Wednesday: [timetableEntrySchema],
    Thursday: [timetableEntrySchema],
    Friday: [timetableEntrySchema],
  },
}, {
  timestamps: true,
});

const Section = mongoose.model("Section", sectionSchema);

module.exports = Section;
