const jwt = require("jsonwebtoken");
const instructorDB = require("../models/instructorModel");
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALT_ROUNDS);

exports.getRegister = (req, res) => {
  res.render("Signup.ejs");
};

exports.initPrincipal = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const job = req.body.job;
  const role = "admin";

  // Validate the input
  if (!username || !password || !email || !job) {
    res.redirect("/instructor/register");
    return;
  }
  try {
    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      }
      // Create the user
      const savedUser = new instructorDB({
        username: username,
        password: hash,
        email: email,
        job: job,
        role: role,
      });
      savedUser.save();
      // Return the token
      res.redirect("/instructor/login");
    });
  } catch (err) {
    console.log(err);
  }
};

exports.register = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const job = req.body.job;

  // Validate the input
  if (!username || !password || !email || !job) {
    res.redirect("/instructor/register");
    return;
  }
  try {
    // Check if the username already exists
    const user = await instructorDB.findOne({ username });
    if (user) {
      res.redirect("/instructor/register");
      return;
    }

    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);

    // Create the user
    const savedUser = await instructorDB.create({
      username: username,
      password: hash,
      email: email,
      job: job,
    });

    // Generate a JWT token
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    savedUser.save();
    // Return the token
    res.redirect("/instructor/login");
  } catch (err) {
    console.log(err);
  }
};

exports.getLogin = (req, res) => {
  res.render("login.ejs");
};

exports.login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await instructorDB.findOne({ username }).select("+password");

  if (user) {
    const hash = user.password;
    const isPassword = await bcrypt.compare(password, hash);
    if (isPassword) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("access_token", token).redirect("/");
    } else {
      res.redirect("/instructor/login");
    }
  } else {
    res.redirect("/instructor/login");
  }
};
