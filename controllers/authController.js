const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const user = await User.findOne({ username }).lean().exec();

  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({ message: "Login successful", token, id: user._id });
};

const logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logout successful" });
};

module.exports = { login, logout };
