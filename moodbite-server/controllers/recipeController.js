const { Recipe } = require("../models");

class RecipeController {
  // 1. CREATE: Simpan Resep ke Favorit
  static async createRecipe(req, res, next) {
    try {
      // Data ini dikirim dari Frontend (hasil output dari AI Controller)
      const {
        title,
        ingredients,
        instructions,
        imageUrl,
        mood,
        calories,
        protein,
        fat,
        readyInMinutes,
      } = req.body;

      if (!title) {
        throw { name: "BadRequest", message: "Recipe title is required" };
      }

      const newRecipe = await Recipe.create({
        title,
        // Tips: Karena di DB tipe 'ingredients' adalah TEXT, sedangkan dari AI berupa Array,
        // Kita ubah jadi String JSON biar aman.
        ingredients: Array.isArray(ingredients)
          ? JSON.stringify(ingredients)
          : ingredients,
        instructions: Array.isArray(instructions)
          ? JSON.stringify(instructions)
          : instructions,
        imageUrl,
        mood,
        calories,
        protein,
        fat,
        readyInMinutes,
        UserId: req.user.id,
      });

      res.status(201).json({
        message: "Recipe saved to favorites!",
        recipe: newRecipe,
      });
    } catch (error) {
      next(error);
    }
  }

  // 2. READ: Ambil Semua Resep Milik User yang Login
  static async getRecipes(req, res, next) {
    try {
      const recipes = await Recipe.findAll({
        where: { UserId: req.user.id },
        order: [["createdAt", "DESC"]],
      });

      const formattedRecipes = recipes.map((el) => {
        let parsedIngredients = el.ingredients;
        let parsedInstructions = el.instructions;
        try {
          parsedIngredients = JSON.parse(el.ingredients);
          parsedInstructions = JSON.parse(el.instructions);
        } catch (e) {
          // Kalau gagal parse (bukan JSON), biarkan apa adanya
        }
        return {
          ...el.toJSON(),
          ingredients: parsedIngredients,
          instructions: parsedInstructions,
        };
      });

      res.status(200).json(formattedRecipes);
    } catch (error) {
      next(error);
    }
  }

  // 3. DELETE: Hapus Resep
  static async deleteRecipe(req, res, next) {
    try {
      const { id } = req.params;

      const recipe = await Recipe.findByPk(id);
      if (!recipe) {
        throw { name: "NotFound", message: "Recipe not found" };
      }

      if (recipe.UserId !== req.user.id) {
        throw {
          name: "Forbidden",
          message: "You are not authorized to delete this recipe",
        };
      }

      await recipe.destroy();

      res
        .status(200)
        .json({ message: `Recipe '${recipe.title}' has been deleted.` });
    } catch (error) {
      next(error);
    }
  }

  // 4. DETAIL: Detail info Resep
  static async getRecipeById(req, res, next) {
    try {
      const { id } = req.params;
      const recipe = await Recipe.findByPk(id);

      if (!recipe) throw { name: "NotFound", message: "Recipe not found" };

      if (recipe.UserId !== req.user.id) {
        throw {
          name: "Forbidden",
          message: "This recipe belongs to another chef",
        };
      }

      // Parse Ingredients & Instructions
      let parsedIngredients = recipe.ingredients;
      let parsedInstructions = recipe.instructions;
      try {
        parsedIngredients = JSON.parse(recipe.ingredients);
      } catch (e) {}
      try {
        parsedInstructions = JSON.parse(recipe.instructions);
      } catch (e) {}

      res.status(200).json({
        ...recipe.toJSON(),
        ingredients: parsedIngredients,
        instructions: parsedInstructions,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RecipeController;
