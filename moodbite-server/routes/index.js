const express = require("express");
const router = express();
const UserController = require("../controllers/userController");
const AIController = require("../controllers/aiController");
const RecipeController = require("../controllers/recipeController");
const authentication = require("../middlewares/authentication");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/google-login", UserController.googleLogin);

router.use(authentication);

router.patch("/update-password", UserController.updatePassword);
router.post("/gemini-recommend", AIController.getRecommendation);

router.get("/profile", UserController.getUserProfile);
router.put("/profile", UserController.updateProfile);
router.post("/request-otp", UserController.requestOtp);
router.patch("/reset-password-otp", UserController.resetPasswordWithOtp);

router.post("/recipes", RecipeController.createRecipe);
router.get("/recipes", RecipeController.getRecipes);
router.get("/recipes/:id", RecipeController.getRecipeById);
router.delete("/recipes/:id", RecipeController.deleteRecipe);

module.exports = router;
