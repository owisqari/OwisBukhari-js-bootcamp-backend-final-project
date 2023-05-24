const instructorDB = require("../models/instructorModel");
const courseDB = require("../models/CourseModel");
const studentDB = require("../models/StudentModel");

exports.allMyCourses = async (req, res) => {
  try {
    const admin = await instructorDB.findById(res.locals.userId);
    if (admin.role !== "admin") {
      const id = res.locals.userId;
      const courses = await courseDB
        .find()
        .where("instructorId")
        .equals(id)
        .populate("instructorId");
      res.render("courses.ejs", { courses: courses });
      return;
    } else {
      const allCourses = await courseDB.find().populate("instructorId");
      res.render("Courses.ejs", { courses: allCourses });
    }
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
      courseRequirement: req.body.courseRequirement,
      courseDescription: req.body.courseDescription,
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
    const admin = await instructorDB.findById(res.locals.userId);
    if (admin.role !== "admin") {
      const course = await courseDB.findById(req.params.id);
      if (course.instructorId == res.locals.userId) {
        res.render("editCourse.ejs", { course: course });
        return;
      } else {
        res.redirect("/");
        return;
      }
    } else {
      const course = await courseDB.findById(req.params.id);
      res.render("editCourse.ejs", { course: course });
    }
  } catch (err) {
    res.redirect("/");
  }
};

exports.editCourse = async (req, res) => {
  try {
    const admin = await instructorDB.findById(res.locals.userId);
    if (admin.role !== "admin") {
      const course = await courseDB.findById(req.params.id);
      if (course.instructorId == res.locals.userId) {
        course.courseName = req.body.courseName;
        course.courseRequirement = req.body.courseRequirement;
        course.courseDescription = req.body.courseDescription;
        const updatedCourse = await course.save();
        res.redirect("/course/allMyCourses");
        return;
      } else {
        res.redirect("/");
        return;
      }
    } else {
      const course = await courseDB.findById(req.params.id);
      course.courseName = req.body.courseName;
      course.courseRequirement = req.body.courseRequirement;
      course.courseDescription = req.body.courseDescription;
      const updatedCourse = await course.save();
      res.redirect("/course/allMyCourses");
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const admin = await instructorDB.findById(res.locals.userId);
    if (admin.role !== "admin") {
      const course = await courseDB.findById(req.params.id);
      if (course.instructorId == res.locals.userId) {
        const updateUser = await studentDB.updateMany(
          { courseId: req.params.id },
          { $pull: { courseId: req.params.id } },
          { multi: true }
        );

        const deletedCourse = await courseDB.findByIdAndDelete(req.params.id);
        res.redirect("/course/allMyCourses");
        return;
      } else {
        res.redirect("/");
        return;
      }
    } else {
      const instructorUser = await instructorDB.updateMany(
        { courseId: req.params.id },
        { $pull: { courseId: req.params.id } },
        { multi: true }
      );
      const updateUser = await studentDB.updateMany(
        { courses: req.params.id },
        { $pull: { courses: req.params.id } },
        { multi: true }
      );
      const deletedCourse = await courseDB.findByIdAndDelete(req.params.id);
      res.redirect("/course/allMyCourses");
    }
  } catch (err) {
    console.log(err);
  }
};
