const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    // 1. Cek ada token ga di header?
    const { authorization } = req.headers;
    if (!authorization) {
      throw { name: "Unauthorized" };
    }

    // 2. Format token biasanya "Bearer <token>"
    const access_token = authorization.split(" ")[1];
    if (!access_token) {
      throw { name: "Unauthorized" };
    }

    // 3. Verifikasi token
    const payload = verifyToken(access_token);

    // 4. Cari user di DB
    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: "Unauthorized" };
    }

    // 5. Simpan data user ke request (biar bisa dipake di controller nanti)
    req.user = { id: user.id, email: user.email };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
