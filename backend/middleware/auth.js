const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Récupérer le token depuis l'en-tête Authorization (format: "Bearer token")
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1]; // Récupérer le deuxième élément après "Bearer"

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({ msg: "Pas de token, accès refusé" });
  }

  // Vérifier et décoder le token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token non valide" });
  }
};

// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//   // Récupérer le token depuis l'en-tête
//   const token = req.header("x-auth-token");

//   // Vérifier si le token existe
//   if (!token) {
//     return res.status(401).json({ msg: "Pas de token, accès refusé" });
//   }

//   // Vérifier et décoder le token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Token non valide" });
//   }
// };
