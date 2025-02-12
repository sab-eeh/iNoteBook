const express = require("express");
const User = require("../modules/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_secret = "hello sabeeh";

// ROUTER:1 Authenticate a User by using: POST /api/auth/createuser no Login required
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 3 }).withMessage("Password must be at least 5 characters long"),
  ],
  async (req, res) => {
    let success = false;
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success , errors: errors.array() });
    }

    try {
      // Check if user already exists
      let user = await User.findOne({email: req.body.email });
      if (user) {
        return res.status(400).json({ success , error: "Sorry! A user with this email already exists." });
      }

      // Create new user
      var salt = await bcrypt.genSalt(10);
      const secure_pass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secure_pass, // Consider hashing the password before saving
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_secret);
      success = true
      res.json({ success , authToken });

      // Return the newly created user data
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTER:2 Login a User by using: POST /api/auth/login no Login required

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password", "Passord must not be blank").exists(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "PLease enter with the correct Credentials." });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({
            success,
            error: "PLease enter with the correct Credentials.",
          });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      const authToken = jwt.sign(data, JWT_secret);
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTER:3 Get a user details by using: POST /api/auth/getuser Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
