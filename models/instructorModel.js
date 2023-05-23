const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const instructorSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    courseId: [
      {
        type: Schema.Types.ObjectId,
        ref: "courses",
      },
    ],
  },

  {
    timestamps: true,
  }
);

const instructor = mongoose.model("instructor", instructorSchema);

module.exports = instructor;
