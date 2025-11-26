const User = require('../../Model/User');

let router = require('express').Router();

router.get("/:roll", async (req, res) => {
  const rollNo = req.params.roll;
  const user = await User.findOne({ rollNo });

  if (user) {
    res.send(`
      <h1>${user.username}</h1>
      <p>Roll No: ${user.rollNo}</p>
      ${
        user.photo
          ? `<img src="/${user.rollNo}/photo" alt="User Photo"/>`
          : "<p>No photo uploaded</p>"
      }
    `);
  } else {
    res.send("User not found");
  }
});

module.exports = router;