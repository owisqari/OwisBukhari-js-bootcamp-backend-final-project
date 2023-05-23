const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middlewares/userAuth");
const {
  createCourse,
  getCreateCoursePage,
  editCourse,
  allMyCourses,
  deleteCourse,
  getEditCoursePage,
} = require("../controllers/course");

// create course page and create course function route
router.get("/allMyCourses", verifyUser, allMyCourses);
router.get("/createCourse", verifyUser, getCreateCoursePage);
router.post("/createCourse", verifyUser, createCourse);
router.get("/editCourse/:id", verifyUser, getEditCoursePage);
router.post("/editCourse/:id", verifyUser, editCourse);
router.get("/deleteCourse/:id", verifyUser, deleteCourse);

module.exports = router;
