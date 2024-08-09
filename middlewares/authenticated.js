const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    //console.log(req.headers.authorization); //=> 'Bearer cZMiLh_osig8LEWer2bOMOOrKF5BwpkXdudenG-HjiOBUmbgMe_770U7p4WSf1F_'
    //On veut comparer ^ avec le token du user
    // On doit faire disparaitre le "Beare "
    const tokenToCheck = req.headers.authorization.replace("Bearer ", "");
    //console.log(tokenToCheck);

    // Si il n'y a pas de token dans la requête on stoppe
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "unauthorized" });
    }
    // Si il y en a un on compare avec ceux de la BDD
    const user = await User.findOne({ token: tokenToCheck });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "unauthorized" });
    }
    // je stock user dans la clé valeur que je crée pour l'occasion req.user
    req.user = user;
    return next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = isAuthenticated;
