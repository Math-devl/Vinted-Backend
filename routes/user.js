const express = require("express");
// création des router pour les routes à appeler
// il faut les lier avec index.js
const router = express.Router();

// On aura besoin du modèle User donc on importe
const User = require("../models/User");

// package necessaire pour le password
//npm i uid2 crypto-js

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post("/signup", async (req, res) => {
  try {
    //console.log(req.body);
    const { username, email, password, newsletter } = req.body;
    //console.log(email);

    // Condition si un des paramètres est manquant
    if (!username || !email || !password) {
      console.log("missing parameters");
      return res.status(400).json({ message: "missing parameters" });
    }
    // Est ce que l'email est déjà enregistré dans la BDD : retourne l'objet complet si oui
    const userCheck = await User.findOne({ email: email });
    if (userCheck) {
      console.log("email already exist");
      return res.status(404).json({ message: "email already exist" });
    }
    const salt = uid2(64);
    const token = uid2(64);
    const hash = SHA256(password + salt).toString(encBase64);
    //console.log(hash); => qXsMbtvTYGWaehZcavsEU6NIE8et3AzUj35/6V2Ux6U=
    // on crée le nouvel utilisateur
    const newUser = new User({
      email: email,
      account: {
        username: username,
        // avatar: Object, // nous verrons plus tard comment uploader une image
      },
      newsletter: newsletter,
      token: token,
      hash: hash,
      salt: salt,
    });
    //console.log(newUser);
    await newUser.save();
    console.log(newUser);
    res.json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
