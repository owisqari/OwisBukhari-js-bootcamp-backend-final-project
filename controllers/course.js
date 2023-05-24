const instructorDB = require("../models/instructorModel");
const courseDB = require("../models/CourseModel");

exports.allMyCourses = async (req, res) => {
  try {
    const id = res.locals.userId;
    const courses = await courseDB
      .find()
      .where("instructorId")
      .equals(id)
      .populate("instructorId");
    res.render("courses.ejs", { courses: courses });
  } catch (err) {
    console.log(err);
  }
};
exports.getCreateCoursePage = async (req, res) => {
  try {
    res.render("createCourse.ejs");
  } catch (err) {
    console.log(err);
  }
};
exports.createCourse = async (req, res) => {
  try {
    const savedCourse = await courseDB.create({
      courseName: req.body.courseName,
      courseLanguage: req.body.courseLanguage,
      courseRequirement: req.body.courseRequirement,
      courseDate: req.body.courseDate,
      courseDescription: req.body.courseDescription,
      coursePrice: req.body.coursePrice,
      instructorId: res.locals.userId,
    });
    const courseIdUpdate = await instructorDB.findByIdAndUpdate(
      res.locals.userId,
      {
        $push: { courseId: savedCourse._id },
      }
    );
    courseIdUpdate.save();
    res.redirect("/course/allMyCourses");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditCoursePage = async (req, res) => {
  try {
    const course = await courseDB.findById(req.params.id);
    if (course.instructorId == res.locals.userId) {
      res.render("editCourse.ejs", { course: course });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.redirect("/");
  }
};

exports.editCourse = async (req, res) => {
  try {
    const course = await courseDB.findById(req.params.id);
    if (course.instructorId == res.locals.userId) {
      course.courseName = req.body.courseName;
      course.courseLanguage = req.body.courseLanguage;
      course.courseRequirement = req.body.courseRequirement;
      course.courseDate = req.body.courseDate;
      course.courseDescription = req.body.courseDescription;
      course.coursePrice = req.body.coursePrice;
      const updatedCourse = await course.save();
      res.redirect("/course/allMyCourses");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await courseDB.findById(req.params.id);
    if (course.instructorId == res.locals.userId) {
      const deletedCourse = await courseDB.findByIdAndDelete(req.params.id);
      res.redirect("/course/allMyCourses");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
};
