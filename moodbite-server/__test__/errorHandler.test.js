const errorHandler = require("../middlewares/errorHandler");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("errorHandler middleware", () => {
  test("handles SequelizeValidationError", () => {
    const err = {
      name: "SequelizeValidationError",
      errors: [{ message: "Validation failed" }],
    };
    const res = createRes();
    errorHandler(err, null, res, null);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Validation failed" });
  });

  test("handles EmailPasswordRequired", () => {
    const err = { name: "EmailPasswordRequired" };
    const res = createRes();
    errorHandler(err, null, res, null);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email and Password are required",
    });
  });

  test("handles InvalidCredentials", () => {
    const err = { name: "InvalidCredentials" };
    const res = createRes();
    errorHandler(err, null, res, null);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  test("handles Unauthorized/JsonWebTokenError", () => {
    const err = { name: "Unauthorized" };
    const res = createRes();
    errorHandler(err, null, res, null);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid Token. Please Login First.",
    });
  });

  test("handles MoodRequired", () => {
    const err = { name: "MoodRequired" };
    const res = createRes();
    errorHandler(err, null, res, null);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Please provide your mood status.",
    });
  });

  test("handles NotFound/RecipeNotFound with custom message", () => {
    const err = { name: "RecipeNotFound", message: "Recipe missing" };
    const res = createRes();
    errorHandler(err, null, res, null);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Recipe missing" });
  });

  test("handles BadRequest with message", () => {
    const err = { name: "BadRequest", message: "Bad input" };
    const res = createRes();
    errorHandler(err, null, res, null);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Bad input" });
  });

  test("handles Forbidden with default message", () => {
    const err = { name: "Forbidden" };
    const res = createRes();
    errorHandler(err, null, res, null);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "You are not authorized",
    });
  });

  test("handles Unauthenticated with custom message", () => {
    const err = { name: "Unauthenticated", message: "No token" };
    const res = createRes();
    errorHandler(err, null, res, null);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token" });
  });

  test("handles generic error (500)", () => {
    const err = new Error("boom");
    const res = createRes();
    errorHandler(err, null, res, null);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });
});
