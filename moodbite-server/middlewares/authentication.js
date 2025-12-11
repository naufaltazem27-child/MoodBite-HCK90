const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    // 1. Cek apakah header authorization ada?
    if (!req.headers.authorization) {
      throw { name: "Unauthenticated" };
    }

    // 2. Ambil token (Bearer <token>)
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw { name: "Unauthenticated" };
    }

    // 3. Verifikasi Token
    const payload = verifyToken(token);

    // 4. Cek User di Database
    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: "Unauthenticated" };
    }

    // 5. Simpan data user ke request
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
