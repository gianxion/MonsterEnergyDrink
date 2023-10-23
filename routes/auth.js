const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyTokenAndAuthorization, verifyToken } = require("./verifytoken");

//Register API
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      email: req.body.email,
      password: hashPass,
    });
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});


//3
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found" });
    }

    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) {
      return res
        .status(422)
        .json({ success: false, msg: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (error) {
    console.log(error); // Log the error for debugging
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});


module.exports = router;
