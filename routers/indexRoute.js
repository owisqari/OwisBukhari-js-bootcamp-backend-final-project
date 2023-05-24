const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middlewares/userAuth");
const instructorDB = require("../models/instructorModel");

router.get("/instructor/course", (req, res) => {});

router.get("/", async (req, res) => {
  const users = await instructorDB.find();
  const verifyUser = req.cookies.access_token;
  if (verifyUser) {
    res.render("home.ejs", { user: verifyUser, allUser: users });
  } else {
    res.render("home.ejs", { user: false, allUser: users });
  }
});
router.get("/logout", verifyUser, (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
});

module.exports = router;
