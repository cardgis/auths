const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth"); // Middleware pour vérifier le token
const router = express.Router();

// Route pour l'enregistrement
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Utilisateur déjà existant" });
    }

    // Créer un nouvel utilisateur
    user = new User({ name, email, password });

    // Hasher le mot de passe avant de sauvegarder
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Créer et retourner un token JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// Route pour la connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Générer le token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Retourner le token au client
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route pour récupérer le profil utilisateur
router.get("/profile", auth, async (req, res) => {
  try {
    // Récupérer les informations de l'utilisateur depuis la base de données en excluant le mot de passe
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const router = express.Router();

// // Route pour l'enregistrement
// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Vérifier si l'utilisateur existe déjà
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: "Utilisateur déjà existant" });
//     }

//     // Créer un nouvel utilisateur
//     user = new User({ name, email, password });

//     // Hasher le mot de passe avant de sauvegarder
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     // Créer et retourner un token JWT
//     const payload = { user: { id: user.id } };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.json({ token });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Erreur serveur");
//   }
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Trouver l'utilisateur par email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Utilisateur non trouvé" });
//     }

//     // Vérifier le mot de passe
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Mot de passe incorrect" });
//     }

//     // Générer le token
//     const payload = { user: { id: user.id } };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     // Retourner le token au client
//     res.json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// });

// module.exports = router;
