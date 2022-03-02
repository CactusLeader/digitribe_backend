var express = require("express");
var router = express.Router();

const userModel = require("../models/users");
const messageModel = require("../models/messages");
const interestModel = require("../models/interests");

const fs = require("fs");
var uniqid = require("uniqid");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dtxkm8ots",
  api_key: "917555748568271",
  api_secret: "7V4HBoGAqhpVeGBwnqd8vTZBYy8",
});

/* GET home page. */
router.get("/", function (req, res, next) {
  // input connection
  res.render("index", { title: "Express" });
});

//Signup
router.get("/signup", async function (req, res, next) {
  const interests = await interestModel.find();
  console.log(interests);

  res.json({ interests });
});

router.post("/interest", async function (req, res, next) {
  const newInterest = new interestModel({
    name: req.body.name,
    image: req.body.icon,
  });

  saveInterest = await newInterest.save();
  res.json({ result: true, saveInterest });
});

//SignUP
router.post("/signup/avatar", async function (req, res, next) {
  const filepath = "./tmp/" + uniqid() + ".jpg";
  const avatar = await req.files.avatar.mv(filepath);

  if (!avatar) {
    const avatarUpload = await cloudinary.uploader.upload(filepath);
    console.log(avatarUpload.secure_url);

    fs.unlinkSync(filepath);

    if (avatarUpload) {
      res.json({ result: true, url: avatarUpload.secure_url });
    }
  } else {
    res.json({ result: false });
  }
});

router.post("/signup", async function (req, res, next) {
  let error = [];
  let result = false;
  let saveUser = null;
  let token = null;

  console.log(req.body);

  const data = await userModel.findOne({
    email: req.body.email,
  });

  if (data != null) {
    error.push("utilisateur déjà présent");
  }

  if (error.length == 0) {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const newUser = new userModel({
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      email: req.body.email,
      password: hash,
      birthdate: req.body.birthdate,
      photo: req.body.photo,
      description: req.body.description,
      language: req.body.language,
      interestIds: req.body.interestIds,
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
router.post("/login", async function (req, res, next) {
  let result = false;
  let user = null;
  let error = [];
  let token = null;

  if (req.body.email === "" || req.body.password === "") {
    error.push("champs vides");
  }

  if (error.length === 0) {
    user = await userModel.findOne({
      email: req.body.email,
    });

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        result = true;
        token = user.token;
      } else {
        result = false;
        error.push("mot de passe incorrect");
      }
    } else {
      error.push("email incorrect");
    }
  }

  res.json({ result, user, error, token });
});

//Map
router.get("/map", function (req, res, next) {
  // récup  position personne / personnes présentes proches / recommandation sur la ville
  res.render("index", { title: "Express" });
});

router.post("/map", async function (req, res, next) {
  // enregistre géolocalisation en BDD
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

router.post("/place", async function (req, res, next) {
  // enregistre Photo en BDD
  console.log("req.files.photo", req.files.photo);
  console.log("req.files.photo.name", req.files.photo.name);
  console.log("req.files.photo.mimetype", req.files.photo.mimetype);
  console.log("req.files.photo.data", req.files.photo.data);

  var photoName = "./tmp/" + uniqid() + ".jpg";
  console.log("photoName", photoName);
  var resultCopy = await req.files.photo.mv(photoName);
  console.log(resultCopy);
  if (!resultCopy) {
    res.json({ result: true });
  } else {
    res.json({ result: false });
  }
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

//messages/users/:token/recipients/:id
router.post("/messages", async function (req, res, next) {
  let error = [];
  let result = false;
  let saveMessage = null;

  if (req.body.message === "") {
    error.push("champs vides");
  }

  const dataUser = await userModel.findOne({
    token: req.body.tokenUser,
  });

  if (error.length === 0) {
    const newMessage = new messageModel({
      text: req.body.message,
      date: req.body.date,
      userIdEmit: dataUser._id,
      userIdReception: req.body.recipientId,
      read: false,
    });

    saveMessage = await newMessage.save();

    if (saveMessage) {
      result = true;
    }
  }

  res.json({ result, saveMessage, error });
});

router.get("/messages/users/:token/recipients/:id", function (req, res, next) {
  // pour récupérer les messages
  res.render("index", { title: "Express" });
});

module.exports = router;
