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
  cloud_name: "dgeqxban7",
  api_key: "487115147289289",
  api_secret: "hssz7K4rgUNLRETqmqUQprPaKZ4",
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
  console.log("req.body", req.body);
  console.log("req.body.token", req.body.token);

  const userUpdate = await userModel.updateOne(
    { token: req.body.token },
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

  var resultCloudinary = await cloudinary.uploader.upload(photoName);
  console.log("resultCloudinary", resultCloudinary);
  console.log("resultCloudinary--url", resultCloudinary.secure_url);

  if (!resultCopy) {
    result = true;
    res.json({ result: result, url: resultCloudinary.secure_url });
  } else {
    result = false;
    res.json({ result: result, resultCopy: resultCopy });
  }
  fs.unlinkSync(photoName);
});

//messages/users/:token/recipients
router.get("/contact", async function (req, res, next) {
  const contact = await userModel.find();
  // console.log(contact);

  res.json({ contact });
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
router.get("/profiles/users", async function (req, res, next) {
  // liste personne dans le coin

  const peopleAround = await userModel.find();

  res.json({ peopleAround });
});

//profile/user
router.get("/profiles/users/:id", async function (req, res, next) {
  const id = req.params.id;
  console.log(id);
  const people = await userModel.findById(id);
  console.log(people);

  // Envoi des infos nécéssaires uniquement
  const peopleFind = {
    firstname: people.firstname,
    photo: people.photo,
    description: people.description,
    interests: people.interestsIds,
  };

  res.json({ peopleFind });
});

//messages/users/:token/recipients/:id
router.post(
  "/messages/users/:token/recipients/:id",
  async function (req, res, next) {
    let error = [];
    let result = false;
    let saveMessage = null;

    const token = req.params.token;
    const id = req.params.id;

    if (req.body.message === "") {
      error.push("champs vides");
    }

    const dataUser = await userModel.findOne({
      token: token,
    });

    if (error.length === 0) {
      const newMessage = new messageModel({
        text: req.body.message,
        date: req.body.date,
        userIdEmit: dataUser._id,
        userIdReception: id,
        read: false,
      });

      saveMessage = await newMessage.save();

      if (saveMessage) {
        result = true;
      }
    }

    res.json({ result, saveMessage, error, token: dataUser.token, userId: id });
  }
);

router.get(
  "/messages/users/:token/recipients/:id",
  async function (req, res, next) {
    // pour récupérer les messages
    let result = false;
    const token = req.params.token;
    const idRecipient = req.params.id;

    const dataUser = await userModel.findOne({
      token: token,
    });

    const dataRecipient = await userModel.findById(idRecipient);

    const dataMessagesEmit = await messageModel.find({
      userIdReception: idRecipient,
      userIdEmit: dataUser._id,
    });

    const dataMessagesReception = await messageModel.find({
      userIdReception: dataUser._id,
      userIdEmit: idRecipient,
    });

    if (dataMessagesEmit.length > 0 || dataMessagesReception.length > 0) {
      result = true;
    }

    res.json({
      result,
      dataUser,
      dataRecipient,
      dataMessagesEmit,
      dataMessagesReception,
      id: dataUser._id,
    });
  }
);

router.put(
  "/messages/users/:token/recipients/:id",
  async function (req, res, next) {
    let result = false;

    const token = req.params.token;
    const id = req.params.id;

    const dataUser = await userModel.findOne({
      token: token,
    });

    const readed = await messageModel.updateMany(
      {
        userIdEmit: id,
        userIdReception: dataUser._id,
      },
      {
        read: true,
      }
    );

    if (readed) {
      result = true;
    }

    res.json({ result });
  }
);

router.get("/contact/users/:token", async function (req, res, next) {
  // pour récupérer les messages dans contact
  let result = false;
  const token = req.params.token;

  const dataUser = await userModel.findOne({
    token: token,
  });

  // console.log("dataUser", dataUser);
  // console.log("dataUser._id", dataUser._id);

  const id = dataUser._id;

  const dataMessagesReceive = await messageModel.find({
    userIdReception: id,
  });

  const dataMessagesEmit = await messageModel.find({
    userIdEmit: id,
  });

  const dataUsers2 = [];
  let dataUserFiltered = [];

  for (let i = 0; i < dataMessagesEmit.length; i++) {
    let data = await userModel.findOne({
      _id: dataMessagesEmit[i].userIdReception,
    });
    dataUsers2.push(data);
  }

  // for (let i = 0; i < dataMessagesEmit.length; i++) {
  //   let data2 = await userModel.findOne({
  //     _id: dataMessagesReceive[i].userIdEmit,
  //   });
  //   dataUsers2.push(data2);
  // }

  dataUserFiltered = dataUsers2.map(JSON.stringify);

  uniqueSet = new Set(dataUserFiltered);
  dataUserFilteredFinal = Array.from(uniqueSet).map(JSON.parse);

  if (dataMessagesReceive.length > 0 || dataMessagesEmit.length > 0) {
    result = true;
  }

  res.json({
    result,
    dataMessagesReceive,
    dataMessagesEmit,
    dataUserFilteredFinal,
    id,
  });
});

module.exports = router;
