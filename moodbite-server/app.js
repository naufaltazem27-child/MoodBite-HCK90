if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

// Simple Error Handler
app.use((err, req, res, next) => {
  console.log(err); // Biar gampang debug
  let status = 500;
  let message = "Internal Server Error";

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    status = 400;
    message = err.errors[0].message;
  } else if (err.name === "EmailPasswordRequired") {
    status = 400;
    message = "Email and Password are required";
  } else if (err.name === "BadRequest") {
    status = 400;
    message = err.message || "Bad Request";
  } else if (err.name === "MoodRequired") {
    status = 400;
    message = "Mood is required";
  } else if (err.name === "NotFound") {
    status = 404;
    message = err.message || "Not Found";
  } else if (err.name === "Unauthenticated") {
    status = 401;
    message = "Unauthenticated";
  } else if (err.name === "InvalidCredentials") {
    status = 401;
    message = "Invalid email or password";
  }

  res.status(status).json({ message });
});

app.use(errorHandler);

module.exports = app;
