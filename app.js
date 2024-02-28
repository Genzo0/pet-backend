require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/connectDB");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/assets", express.static("public/images"));

app.use("/api", require("./routes/root"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/animal", require("./routes/animal"));
app.use("/api/user", require("./routes/user"));

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running in http://localhost:${process.env.PORT}`);
  });
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});
