const express = require("express");
const animalController = require("../controllers/animalController");
const upload = require("../middleware/multer");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router
  .route("/")
  .get(animalController.getAnimals)
  .post(upload.single("picture"), animalController.createNewAnimal);

router
  .route("/:id")
  .get(animalController.getAnimalById)
  .post(animalController.adoptAnimal);

module.exports = router;
