if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
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
  } else if (err.name === "InvalidCredentials") {
    status = 401;
    message = "Invalid email or password";
  }

  res.status(status).json({ message });
});

app.use(errorHandler);
app.listen(port, () => {
  console.log(`MoodBite Server running on port http://localhost:${port}`);
});
