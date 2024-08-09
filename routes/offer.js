// packages
const express = require("express");
const cloudinary = require("cloudinary").v2; // configurer dans le fichre index.js
const fileUpload = require("express-fileupload");

// quels modèles seront necessaires
const Offer = require("../models/Offer");
const User = require("../models/User");
const isAuthenticated = require("../middlewares/authenticated");

// pour se lier avec index.js
const router = express.Router();

//fonction pour convertir un buffer en base 64 pour envoyer la photo dans cloudinary, pour ça on veut concaténer certaines infos :
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};
//--------------------------------------------------------------------------------------------------

//Routes CREATE
router.post("/publish", isAuthenticated, fileUpload(), async (req, res) => {
  try {
    // console.log(req.body);
    // On récupère les infos du produit provenant de la requête pour enregistrer dans la BDD
    const { title, description, price, condition, city, brand, size, color } =
      req.body;
    //console.log(req.files.picture);
    // Le package cloudinary utilise la méthode cloudinary.uploader.upload(file, options, callback) pour envoyer un fichier
    const result = await cloudinary.uploader.upload(
      convertToBase64(req.files.picture)
    );
    //console.log(result);

    const newOffer = new Offer({
      product_name: title,
      product_description: description,
      product_price: price,
      product_details: [
        {
          MARQUE: brand,
        },
        {
          TAILLE: size,
        },
        {
          ÉTAT: condition,
        },
        {
          COULEUR: color,
        },
        {
          EMPLACEMENT: city,
        },
      ],
      owner: req.user,
      product_image: result,
    });

    await newOffer.save();

    res.json(newOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//-------------------------------------------------------------------------------

// Routes READ
router.get("/offers", (req, res) => {});

//-------------------------------------------------------------------------------
module.exports = router;
