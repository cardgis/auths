const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/protected", require("./routes/protected"));

// Démarrer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
);
