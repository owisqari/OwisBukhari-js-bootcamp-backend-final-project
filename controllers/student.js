const studentDB = require("../models/StudentModel");
const courseDB = require("../models/CourseModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALT_ROUNDS);

// register a new student account
exports.register = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Validate the input
  if (!username || !password) {
    res.status(400).json({ message: "Please enter all required fields" });
    return;
  }
  try {
    const user = await studentDB.findOne({ username });
    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);
    // Create a new user
    const savedUser = await studentDB.create({
      username: username,
      password: hash,
    });
    // generate a token
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ savedUser, token: token });
  } catch (err) {
    console.log(err);
  }
};

// login a student account with username and password
exports.login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // search the user in the database
  const user = await studentDB.findOne({ username });

  if (user) {
    // compare the password with the hash
    const hash = user.password;
    const isPassword = await bcrypt.compare(password, hash);
    if (isPassword) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ token: token });
    } else {
      res.status(400).json({ message: "Invalid password" });
    }
  } else {
    res.status(400).json({ message: "User does not exist" });
  }
};

// get all courses in the database
exports.getAllCourses = async (req, res) => {
  const courses = await courseDB.find();
  res.status(200).json({ courses });
};

// register a course with course id
exports.registerCourse = async (req, res) => {
  const courseId = req.params.id;
  const studentId = res.locals.currentUser.userId;

  if (courseId && studentId) {
    res.status(400).json({ message: "Please enter all required fields" });
    return;
  }

  // check if the course and student exist
  const course = await courseDB.findById(courseId);
  const student = await studentDB.findById(studentId);

  // check if the student has already registered the course
  if (course && student) {
    const isRegistered = course.studentId.includes(studentId);
    if (isRegistered) {
      res.status(400).json({ message: "You already registered this course" });
      return;
    }

    // register the course to the student and the student to the course
    student.courses.push(courseId);
    course.studentId.push(studentId);
    await student.save();
    await course.save();
    res.status(200).json({ message: "Course registered successfully" });
    return;
  }
  res.status(400).json({ message: "Course or student does not exist" });
};

// cancel a course with course id
exports.cancelCourse = async (req, res) => {
  const courseId = req.params.id;
  const studentId = res.locals.currentUser.userId;

  // check if the course and student exist
  const course = await courseDB.findById(courseId);
  const student = await studentDB.findById(studentId);

  // check if the student has already registered the course
  if (course && student) {
    const isRegistered = course.studentId.includes(studentId);
    if (!isRegistered) {
      res.status(400).json({ message: "You have not registered this course" });
      return;
    }
    // cancel the course from the student and the student from the course
    const index2 = student.courses.indexOf(courseId);
    student.courses.splice(index2, 1);
    await student.save();
    const index = course.studentId.indexOf(studentId);
    course.studentId.splice(index, 1);
    await course.save();
    res.status(200).json({ message: "Course cancelled successfully" });
  } else {
    res.status(400).json({ message: "Course or student does not exist" });
  }
};
