const Animal = require("../models/Animal");
const nodemailer = require("nodemailer");

const getAnimals = async (req, res) => {
  try {
    const animals = await Animal.find().lean();
    if (!animals?.length) {
      return res.status(400).json({ message: "No Animal Found" });
    }
    res.json(animals);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createNewAnimal = async (req, res) => {
  const { name, species, description, age, ownerId } = req.body;

  const picture = req.file.filename;

  //confirm data
  if (!name || !species || !description || !age || !ownerId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const animalObject = {
    name,
    species,
    description,
    age,
    picture: "assets/" + picture,
    ownerId,
  };

  //save and store animal

  const animal = await Animal.create(animalObject);

  if (animal) {
    res.status(201).json({ message: `New Animal ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
};

const getAnimalById = async (req, res) => {
  const { id } = req.params;
  try {
    const animal = await Animal.findById(id).lean();
    if (!animal) {
      return res.status(400).json({ message: "No Animal Found" });
    }
    res.json(animal);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendEmail = async (animalName, adopterName, phoneNumber, address) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "g92711835@gmail.com",
      pass: "rzcajolskbkdzrjx",
    },
  });

  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: "g92711835@gmail.com",
      to: ["g92711835@gmail.com"],
      subject: "Adoption Request",
      html: `
      <html>
          <body>
            <h1>Adoption Request</h1>
            <p><strong>${animalName}</strong> wants to be adopted by <strong>${adopterName}</strong>.</p>
            <p><strong>Contact Information:</strong></p>
            <ul>
              <li><strong>Phone Number:</strong> ${phoneNumber}</li>
              <li><strong>Address:</strong> ${address}</li>
            </ul>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

const adoptAnimal = async (req, res) => {
  const { id } = req.params;
  const { name, phoneNumber, address } = req.body;

  if (!name || !phoneNumber || !address) {
    return res
      .status(400)
      .json({ message: "Name, phone number, and address required" });
  }

  try {
    const animal = await Animal.findById(id).lean();

    if (!animal) {
      return res.status(400).json({ message: "No Animal Found" });
    }

    await sendEmail(animal.name, name, phoneNumber, address);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getAnimals, createNewAnimal, getAnimalById, adoptAnimal };
