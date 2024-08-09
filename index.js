// On appelle les packages necessaire au projet
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
require("dotenv").config(); // Permet d'activer les variables d'environnement qui se trouvent dans le fichier `.env`

// on lance l'application
const app = express();
app.use(cors());

// Création de la BDD mongoDB
mongoose.connect(process.env.MONGODB_URI);

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOU_NAME,
  api_key: process.env.CLOU_API_KEY,
  api_secret: process.env.CLOU_API_SECRET,
});

// Utilisation des données body de postman
app.use(express.json());

// Import des routes du dossier route
// création d'un variable avec le chemin jusqu'au fichier
// utilisation de l'app en précisant la bonne variable
const userRouter = require("./routes/user");
app.use("/user", userRouter);

const offerRouter = require("./routes/offer");
app.use("/offer", offerRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: "all route" });
});

app.listen(PORT, () => {
  console.log("serveur started");
});
