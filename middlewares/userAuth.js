const jwt = require("jsonwebtoken");
require("dotenv").config();

// verify token middleware
exports.verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.redirect("/instructor/login");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      res.redirect("/instructor/login");
    } else {
      res.locals.currentUser = data;
      res.locals.userId = data.userId;
      res.locals.token = token;
      next();
    }
  });
};
