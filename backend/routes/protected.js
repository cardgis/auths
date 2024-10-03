const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

// Route protégée
router.get("/", auth, (req, res) => {
  res.json({ msg: "Accès aux données protégées" });
});

module.exports = router;
