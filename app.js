const express = require("express");
const app = express();
const url = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
const instructorapiRouter = require("./routers/instructorRouter");
const courseapiRouter = require("./routers/courseRouter");
const homeRouter = require("./routers/indexRoute");
const studentRouter = require("./routers/studentRouter");

url
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Cannot connect to the database", err);
  });

app.use(express.static("public"));

// tailwind congif
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./views/*.{html,js,css}", "./views/*.ejs"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  // ...
};

//config cookie-parser
app.use(cookieParser());
//config body-parser
app.use(bodyParser.urlencoded({ extended: false }));
// config json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//config ejs
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", homeRouter);
app.use("/instructor", instructorapiRouter);
app.use("/course", courseapiRouter);
app.use("/student", studentRouter);
app.listen(process.env.PORT, () => {
  console.log("Server running on port 8080");
});
