const errorHandler = (err, req, res, next) => {
  console.log("ERROR LOG:", err);

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
  } else if (err.name === "Unauthorized" || err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid Token. Please Login First.";
  } else if (err.name === "MoodRequired") {
    status = 400;
    message = "Please provide your mood status.";
  } else if (err.name === "RecipeNotFound" || err.name === "NotFound") {
    status = 404;
    message = err.message || "Data not found";
  } else if (err.name === "BadRequest") {
    status = 400;
    message = err.message;
  } else if (err.name === "Forbidden") {
    status = 403;
    message = err.message || "You are not authorized";
  }

  res.status(status).json({ message });
};

module.exports = errorHandler;
