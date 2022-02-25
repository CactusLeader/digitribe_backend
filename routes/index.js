var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // input connection
  res.render("index", { title: "Express" });
});

//SignUP
router.get("/signUp", function (req, res, next) {
  // formulaire inscription
  res.render("index", { title: "Express" });
});

//SignUP
router.post("/signUp", function (req, res, next) {
  // récup  photo, description, langue et redirection vers /map
  res.render("index", { title: "Express" });
});

//Login
router.post("/login", function (req, res, next) {
  // récup name et password et redirect vers /map si OK
  res.render("index", { title: "Express" });
});

//Map
router.get("/map", function (req, res, next) {
  // récup  position personne / personnes présentes proches / recommandation sur la ville
  res.render("index", { title: "Express" });
});

router.post("/place", function (req, res, next) {
  // envoi géolocalisation
  // envoi info POI
  res.render("index", { title: "Express" });
});

//Contact
router.get("/messages/users/:token/recipients", function (req, res, next) {
  // récup  personnes déjà contacté / derniers messages
  res.render("index", { title: "Express" });
});

//EditProfile
router.get("/editprofile/:token", function (req, res, next) {
  // afficher profil
  res.render("index", { title: "Express" });
});

router.put("/editprofile/:token", function (req, res, next) {
  // modifier photo, langue, centres d'intérets, description
  res.render("index", { title: "Express" });
});

//City
router.get("/cities/:id", function (req, res, next) {
  // obtenir info ville
  res.render("index", { title: "Express" });
});

//profile/list
router.get("/profiles/users", function (req, res, next) {
  // liste personne dans le coin
  res.render("index", { title: "Express" });
});

//profile/user
router.get("/profiles/users/:id", function (req, res, next) {
  // information user
  res.render("index", { title: "Express" });
});

//message
router.post("/messages/users/:token/recipients/:id", function (req, res, next) {
  // pour discuter avec quelqu'un
  res.render("index", { title: "Express" });
});

router.get("/messages/users/:token/recipients/:id", function (req, res, next) {
  // pour récupérer les messages
  res.render("index", { title: "Express" });
});

module.exports = router;
