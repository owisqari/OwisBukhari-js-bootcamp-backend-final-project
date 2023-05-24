const express = require("express");
const router = express.Router();
const {
  register,
  getRegister,
  login,
  getLogin,
  initPrincipal,
} = require("../controllers/instructor");

router.post("/initPrincipal", initPrincipal);

router.get("/register", getRegister);
// register route
router.post("/register", register);

router.get("/login", getLogin);
// login route
router.post("/login", login);

module.exports = router;
