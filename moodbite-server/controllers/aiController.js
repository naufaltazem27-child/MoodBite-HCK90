const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

class AiController {
  static async getRecommendation(req, res, next) {
    try {
      const { mood } = req.body;
      if (!mood) {
        throw { name: "MoodRequired" };
      }

      // === 1. TANYA GEMINI ===
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // PERBAIKAN PROMPT: Minta nama makanan yang umum dan sederhana
      // "Simple, generic food names" agar mudah dicari di DB
      const prompt = `
        I am feeling ${mood}. 
        Suggest 3 distinct meals (generic food names only) that fit this mood. 
        Avoid adjectives like "Hearty", "Zesty", "Grandma's". Keep it simple like "Lentil Stew" instead of "Hearty Lentil Stew".
        Return the result ONLY as a valid JSON array of strings. 
        Example format: ["Chicken Soup", "Chocolate Cake", "Grilled Salmon"].
        Do not add markdown formatting.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response
        .text()
        .trim()
        .replace(/```json|```/g, "")
        .trim();
      const recommendedDishes = JSON.parse(responseText);

      // === 2. CARI DATA DI SPOONACULAR (DENGAN FALLBACK) ===

      const recipePromises = recommendedDishes.map(async (dishName) => {
        const spoonUrl = `https://api.spoonacular.com/recipes/complexSearch`;

        try {
          // Percobaan 1: Cari dengan nama asli dari Gemini
          let response = await axios.get(spoonUrl, {
            params: {
              apiKey: process.env.SPOONACULAR_API_KEY,
              query: dishName,
              number: 1,
              addRecipeInformation: true,
              addRecipeNutrition: true,
            },
          });

          // Percobaan 2 (Fallback): Jika kosong, cari kata pertamanya saja
          // Contoh: "Spicy Lentil Stew" kosong -> Cari "Lentil"
          if (response.data.results.length === 0) {
            const simpleName = dishName.split(" ")[1] || dishName.split(" ")[0]; // Ambil kata kunci utama
            console.log(
              `Retrying search for '${dishName}' with keyword '${simpleName}'...`
            );

            response = await axios.get(spoonUrl, {
              params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                query: simpleName, // Pakai kata kunci simpel
                number: 1,
                addRecipeInformation: true,
                addRecipeNutrition: true,
              },
            });
          }

          const recipeData = response.data.results[0];

          if (recipeData) {
            return {
              title: recipeData.title,
              image: recipeData.image,
              readyInMinutes: recipeData.readyInMinutes,
              servings: recipeData.servings,
              calories:
                recipeData.nutrition.nutrients.find(
                  (n) => n.name === "Calories"
                )?.amount + " kcal",
              protein:
                recipeData.nutrition.nutrients.find((n) => n.name === "Protein")
                  ?.amount + " g",
              fat:
                recipeData.nutrition.nutrients.find((n) => n.name === "Fat")
                  ?.amount + " g",
              sourceUrl: recipeData.sourceUrl,
              summary: recipeData.summary,
            };
          }
        } catch (err) {
          console.log(`Error fetching ${dishName}:`, err.message);
        }
        return null;
      });

      const results = await Promise.all(recipePromises);
      const finalRecipes = results.filter((item) => item !== null);

      if (finalRecipes.length === 0) throw { name: "RecipeNotFound" };

      res.status(200).json({
        mood: mood,
        ai_suggestions: recommendedDishes, // Saran asli Gemini
        recipes: finalRecipes, // Data real yang berhasil didapat (bisa 2 atau 3)
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = AiController;
