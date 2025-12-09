const express = require("express");
const router = express();
const UserController = require("../controllers/userController");
const AIController = require("../controllers/aiController");
const authentication = require("../middlewares/authentication");

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.use(authentication);

router.post("/gemini-recommend", AIController.getRecommendation);

module.exports = router;
