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

router.post("/recipes", RecipeController.createRecipe);
router.get("/recipes", RecipeController.getRecipes);
router.delete("/recipes/:id", RecipeController.deleteRecipe);

module.exports = router;
