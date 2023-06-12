const express = require("express");
const router = express.Router();
const { verifyStudent } = require("../middlewares/userAuth");

// import the controllers
const {
  register,
  login,
  getAllCourses,
  registerCourse,
  cancelCourse,
} = require("../controllers/student");

// routes
router.post("/Register", register);
router.post("/Login", login);
router.get("/Courses", getAllCourses);
router.post("/RegisterCourse/:id", registerCourse);
router.delete("/CancelCourse/:id", cancelCourse);

module.exports = router;
