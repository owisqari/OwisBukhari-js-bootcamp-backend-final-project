const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    courseRequirement: String,
    courseDescription: {
      type: String,
      required: true,
    },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "instructor",
    },
    studentId: [
      {
        type: Schema.Types.ObjectId,
        ref: "student",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const courses = mongoose.model("courses", courseSchema);

module.exports = courses;
