const User = require("../models/User");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    if (!users?.length) {
      return res.status(400).json({ message: "No User Found" });
    }
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createNewUser = async (req, res) => {
  const { username, password, name, phoneNumber, address } = req.body;

  //confirm data
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!name || !phoneNumber || !address) {
    return res
      .status(400)
      .json({ message: "Name, phone number, and address required" });
  }

  //check duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(400).json({
      message: `${username} username has been used, pick another username!`,
    });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = {
    username,
    password: hashedPwd,
    name,
    phoneNumber,
    address,
  };

  //save and store user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New User ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
};

module.exports = { getUsers, createNewUser };
