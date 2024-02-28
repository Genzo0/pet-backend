const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  picture: {
    type: String, // Assuming URL to the picture
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user who adopted the animal
    required: true,
  },
});

const Animal = mongoose.model("Animal", animalSchema);

module.exports = Animal;
