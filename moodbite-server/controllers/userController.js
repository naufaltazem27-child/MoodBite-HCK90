const { User } = require("../models");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const { sendOTP } = require("../helpers/email");

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

  static async updatePassword(req, res, next) {
    try {
      const { newPassword } = req.body;
      const userId = req.user.id;

      // Validasi Input
      if (!newPassword) {
        throw {
          name: "BadRequest",
          message: "New password is required",
        };
      }

      if (newPassword.length < 5) {
        throw {
          name: "BadRequest",
          message: "Password min 5 chars",
        };
      }

      // Hash Password Baru (Manual karena hook kita cuma beforeCreate)
      const hashedPassword = hashPassword(newPassword);

      // Update ke database
      await User.update(
        {
          password: hashedPassword,
        },
        { where: { id: userId } }
      );

      res.status(200).json({
        message: "Password has been updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // UPDATE PROFILE : SELAIN PW
  static async updateProfile(req, res, next) {
    try {
      const { username, phoneNumber, address } = req.body;
      const user = await User.findByPk(req.user.id);
      if (!user) {
        throw {
          name: "NotFound",
        };
      }

      await user.update({ username, phoneNumber, address });
      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          address: user.address,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async requestOtp(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        throw { name: "NotFound" };
      }

      // Generate 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // Expired dalam 5 menit
      const otpExpiration = new Date(new Date().getTime() + 5 * 60000);

      await user.update({ otp, otpExpiration });

      // Kirim Email via Resend
      await sendOTP(user.email, otp);

      res.status(200).json({ message: `OTP sent to ${user.email}` });
    } catch (error) {
      next(error);
    }
  }

  static async resetPasswordWithOtp(req, res, next) {
    try {
      const { otp, newPassword } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user) {
        throw { name: "NotFound" };
      }

      // Validasi OTP
      if (user.otp !== otp) {
        throw { name: "BadRequest", message: "Invalid OTP Code" };
      }
      if (new Date() > user.otpExpiration) {
        throw { name: "BadRequest", message: "OTP Expired" };
      }

      // Hash & Update Password
      const hashedPassword = hashPassword(newPassword);

      await user.update({
        password: hashedPassword,
        otp: null,
        otpExpiration: null,
      });

      res.status(200).json({ message: "Password successfully changed" });
    } catch (error) {
      next(error);
    }
  }

  static async getUserProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ["id", "email", "username", "phoneNumber", "address"],
      });

      if (!user) {
        throw {
          name: "NotFound",
        };
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
