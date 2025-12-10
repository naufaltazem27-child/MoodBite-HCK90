const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      const newUser = await User.create({ username, email, password });

      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // 1. Cek Email ada ga?
      if (!email || !password) {
        throw { name: "EmailPasswordRequired" };
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw { name: "InvalidCredentials" };
      }

      // 2. Cek Password bener ga?
      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw { name: "InvalidCredentials" };
      }

      // 3. Generate Token
      const access_token = signToken({ id: user.id });

      res.status(200).json({ access_token, username: user.username });
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      // Terima token dari frontend
      const { googleToken } = req.body;
      if (!googleToken) {
        throw {
          name: "BadRequest",
          message: "Google Token is required",
        };
      }

      // 2. Verifikasi token ke Google
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      // Data yang didapat dari Google:
      const { email, name } = payload;

      // Cek Database: User ini sudah ada belum?
      let user = await User.findOne({ where: { email } });

      if (!user) {
        // Kalau belum ada, kita buatkan user baru (Register Otomatis)
        user = await User.create({
          username: name,
          email: email,
          // Password random karena dia login pake Google (gak akan dipake login manual)
          password: Math.random().toString(36).slice(-8),
        });
      }

      // Buatkan Token JWT (Tiket Masuk Aplikasi Kita)
      const access_token = signToken({ id: user.id });

      res.status(200).json({
        access_token,
        username: user.username,
        message: "Google Login Success",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
