const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

// Data Dummy
const dummyUser = {
  username: "Test User",
  email: "test@mail.com",
  password: "password123",
  phoneNumber: "08123456789",
  address: "Jl. Testing No. 1",
};

beforeAll(async () => {
  try {
    await sequelize.sync({ force: true });
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    await queryInterface.dropAllTables();
    await sequelize.close();
  } catch (error) {
    console.log(error);
  }
});

// TEST CASE 1 : FITUR REGISTER
describe("POST /register", () => {
  // POSITIVE CASE : REGISTER BERHASIL
  test("201 Success Register - create new user", async () => {
    const response = await request(app).post("/register").send(dummyUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email", dummyUser.email);
  });

  // NEGATIVE CASE : INPUT TIDAK LENGKAP
  test("400 Failed Register - Username/Email/Password Required", async () => {
    const response = await request(app).post("/register").send({
      username: "No Pass",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  // NEGATIVE CASE : EMAIL DUPLIKAT
  test("400 Failed Register - Email Already Exists", async () => {
    const response = await request(app).post("/register").send(dummyUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/unique/i);
  });
});

// TEST CASE 2 : FITUR LOGIN
describe("POST /login", () => {
  // POSITIVE CASE : LOGIN BERHASIL
  test("200 Success Login - return access_token", async () => {
    const response = await request(app).post("/login").send({
      email: dummyUser.email,
      password: dummyUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
  });

  // NEGATIVE CASE : SALAH PASSWORD
  test("401 Failed Login - Wrong Password", async () => {
    const response = await request(app).post("/login").send({
      email: dummyUser.email,
      password: "salahpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  // NEGATIVE CASE : EMAIL TIDAK TERDAFTAR
  test("401 Failed Login - Email Not Found", async () => {
    const response = await request(app).post("/login").send({
      email: "hantu@mail.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  // NEGATIVE CASE : INPUT KOSONG
  test("400 Failed Login - Email/Password Required", async () => {
    const response = await request(app).post("/login").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

// TEST CASE 3 : UPDATE PASSWORD
describe("PATCH /update-password", () => {
  let token;

  beforeAll(async () => {
    const response = await request(app).post("/login").send({
      email: dummyUser.email,
      password: dummyUser.password,
    });
    token = response.body.access_token;
  });

  test("200 Success Update Password", async () => {
    const response = await request(app)
      .patch("/update-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ newPassword: "newpass123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  test("400 Failed Update Password - Missing newPassword", async () => {
    const response = await request(app)
      .patch("/update-password")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });

  test("400 Failed Update Password - Password Too Short", async () => {
    const response = await request(app)
      .patch("/update-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ newPassword: "123" });

    expect(response.status).toBe(400);
  });

  test("401 Failed Update Password - No Token", async () => {
    const response = await request(app)
      .patch("/update-password")
      .send({ newPassword: "newpass123" });

    expect(response.status).toBe(401);
  });
});

// TEST CASE 4 : UPDATE PROFILE
describe("PUT /profile", () => {
  let token;

  beforeAll(async () => {
    const response = await request(app).post("/login").send({
      email: dummyUser.email,
      password: "newpass123",
    });
    token = response.body.access_token;
  });

  test("200 Success Update Profile", async () => {
    const response = await request(app)
      .put("/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "Updated User",
        phoneNumber: "08999999999",
        address: "New Address",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.user.username).toBe("Updated User");
  });

  test("401 Failed Update Profile - No Token", async () => {
    const response = await request(app)
      .put("/profile")
      .send({
        username: "Updated User",
      });

    expect(response.status).toBe(401);
  });
});

// TEST CASE 5 : GET PROFILE
describe("GET /profile", () => {
  let token;

  beforeAll(async () => {
    const response = await request(app).post("/login").send({
      email: dummyUser.email,
      password: "newpass123",
    });
    token = response.body.access_token;
  });

  test("200 Success Get Profile", async () => {
    const response = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("email", dummyUser.email);
  });

  test("401 Failed Get Profile - No Token", async () => {
    const response = await request(app)
      .get("/profile");

    expect(response.status).toBe(401);
  });
});

// TEST CASE 6 : REQUEST OTP
describe("POST /request-otp", () => {
  let token;

  beforeAll(async () => {
    const response = await request(app).post("/login").send({
      email: dummyUser.email,
      password: "newpass123",
    });
    token = response.body.access_token;
  });

  test("200 Success Request OTP", async () => {
    const response = await request(app)
      .post("/request-otp")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  test("401 Failed Request OTP - No Token", async () => {
    const response = await request(app)
      .post("/request-otp");

    expect(response.status).toBe(401);
  });
});

// TEST CASE 7 : RESET PASSWORD WITH OTP
describe("PATCH /reset-password-otp", () => {
  let token;
  let validOtp;

  beforeAll(async () => {
    const response = await request(app).post("/login").send({
      email: dummyUser.email,
      password: "newpass123",
    });
    token = response.body.access_token;

    // Request OTP first
    await request(app)
      .post("/request-otp")
      .set("Authorization", `Bearer ${token}`);
  });

  test("200 Success Reset Password with OTP", async () => {
    // Since OTP is mocked/generated, we need to fetch the user's OTP from DB
    const { User } = require("../models");
    const user = await User.findOne({ where: { email: dummyUser.email } });
    validOtp = user.otp;

    const response = await request(app)
      .patch("/reset-password-otp")
      .set("Authorization", `Bearer ${token}`)
      .send({
        otp: validOtp,
        newPassword: "resetpass123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  test("400 Failed Reset Password - Invalid OTP", async () => {
    const response = await request(app)
      .patch("/reset-password-otp")
      .set("Authorization", `Bearer ${token}`)
      .send({
        otp: "000000",
        newPassword: "resetpass123",
      });

    expect(response.status).toBe(400);
  });

  test("401 Failed Reset Password - No Token", async () => {
    const response = await request(app)
      .patch("/reset-password-otp")
      .send({
        otp: validOtp,
        newPassword: "resetpass123",
      });

    expect(response.status).toBe(401);
  });
});
