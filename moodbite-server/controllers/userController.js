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
}

module.exports = UserController;
