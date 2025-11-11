const mongoose = require("mongoose");
const Section = require("./Model/Section");


async function seedSections() {
  try {
    // Fetch existing students and subjects
    // const students = await Student.find() // Adjust limit as needed
    // const subjects = await Subject.find()

    const timetable = {
      Monday: [
        { subject: "Math", teacher: "Mr. Sharma", time: "09:00 AM" },
        { subject: "English", teacher: "Ms. Verma", time: "10:00 AM" },
      ],
      Tuesday: [
        { subject: "Science", teacher: "Dr. Khan", time: "09:00 AM" },
        { subject: "Math", teacher: "Mr. Sharma", time: "10:00 AM" },
      ],
      Wednesday: [
        { subject: "English", teacher: "Ms. Verma", time: "09:00 AM" },
        { subject: "Science", teacher: "Dr. Khan", time: "10:00 AM" },
      ],
      Thursday: [
        { subject: "Math", teacher: "Mr. Sharma", time: "09:00 AM" },
        { subject: "English", teacher: "Ms. Verma", time: "10:00 AM" },
      ],
      Friday: [
        { subject: "Science", teacher: "Dr. Khan", time: "09:00 AM" },
        { subject: "Math", teacher: "Mr. Sharma", time: "10:00 AM" },
      ],
    };

    const sectionData = {
      section: "2A",
    //   students: students.map(s => s._id),
    //   subjects: subjects.map(sub => sub._id),
      timetable
    };

    // await Section.deleteMany({});
    await Section.create(sectionData);

    console.log("Section seeded successfully!");
  } catch (error) {
    console.error("Error seeding section:", error);
  } 
}

module.exports = seedSections;