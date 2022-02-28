var express = require("express");
var router = express.Router();
var userModel = require("../models/users");

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const userModel = require("../models/users");

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
router.post("/signUp", async function (req, res, next) {
  let error = [];
  let result = false;
  let saveUser = null;
  let token = null;

  const data = await userModel.findOne({
    email: req.body.email,
  });

  if (data != null) {
    error.push("utilisateur déjà présent");
  }

  if (
    req.body.usernameFromFront == "" ||
    req.body.emailFromFront == "" ||
    req.body.passwordFromFront == ""
  ) {
    error.push("champs vides");
  }

  if (error.length == 0) {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const newUser = new userModel({
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      email: req.body.email,
      dateofbirth: req.body.date,
      description: req.body.description,
      language: req.body.language,
      password: hash,
      token: uid2(32),
    });

    saveUser = await newUser.save();

    if (saveUser) {
      result = true;
      token = saveUser.token;
    }
  }

  res.json({ result, saveUser, error, token });
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

router.post("/place", async function (req, res, next) {
  // envoi géolocalisation
  // envoi info POI
  console.log("POST/req.body", req.body);
  const userUpdate = await userModel.updateOne(
    { token: "2yxtGnOEaT_mOCCv0llJn4mVsDZ4sLhc" },
    {
      location: {
        lat: req.body.currentLatitude,
        lon: req.body.currentLongitude,
      },
    }
  );
  console.log("userUpdate", userUpdate);

  let result = false;
  let location = {
    lat: req.body.currentLatitude,
    lon: req.body.currentLongitude,
  };

  if (userUpdate) {
    result = true;
  }

  res.json({ result, location: location });
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
