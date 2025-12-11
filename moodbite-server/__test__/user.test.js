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
