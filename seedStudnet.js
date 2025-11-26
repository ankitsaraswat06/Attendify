const mongoose = require("mongoose");
const User = require("./Model/User");


async function seedSimpleUsers() {
  try {
    await User.deleteMany({ role: "student" });

    const users = [
      {
        rollNo: 101,
        username: "alice",
        role: "student",
        photo: "https://example.com/photos/alice.jpg",
        section: "2A",
        attendance: [
          { subject: "Math", date: new Date("2025-09-08"), status: "Present" },
          { subject: "Science", date: new Date("2025-09-08"), status: "Absent" },
          { subject: "English", date: new Date("2025-09-08"), status: "Present" }
        ]
      },
      {
        rollNo: 102,
        username: "bob",
        email: "bob@example.com",
        role: "student",
        course: "Electronics",
        photo: "https://example.com/photos/bob.jpg",
        section: "2B",
        attendance: [
          { subject: "Math", date: new Date("2025-09-08"), status: "Absent" },
          { subject: "Science", date: new Date("2025-09-08"), status: "Present" },
          { subject: "English", date: new Date("2025-09-08"), status: "Absent" }
        ]
      }
    ];

    await User.insertMany(users);
    console.log("✅ Simple user attendance seeded.");
  } catch (err) {
    console.error("❌ Error seeding users:", err);
  } finally {
    mongoose.connection.close();
  }
}

module.exports = seedSimpleUsers;
