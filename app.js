const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/assets", express.static("public/images"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3002, () => {
  console.log("Server is running on port 3000");
});
