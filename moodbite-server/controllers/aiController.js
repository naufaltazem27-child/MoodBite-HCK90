const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

class AiController {
  static async getRecommendation(req, res, next) {
    try {
      const { mood } = req.body;
      if (!mood) throw { name: "MoodRequired" };

      // 1. GEMINI (Nama, Bahan, Cara Masak)
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        I am feeling ${mood}. 
        Suggest 3 distinct meals. Use SIMPLE, COMMON names (e.g. "Chicken Soup").
        Provide: name, ingredients (strings with measurements), instructions (array of strings).
        Return ONLY valid JSON array of objects.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response
        .text()
        .trim()
        .replace(/```json|```/g, "")
        .trim();
      const aiRecommendations = JSON.parse(responseText);

      // 2. PARALLEL FETCH (Unsplash + Spoonacular)
      const recipePromises = aiRecommendations.map(async (item) => {
        // --- A. FETCH IMAGE DARI UNSPLASH ---
        let imageUrl = "https://placehold.co/600x400?text=No+Image";
        try {
          const unsplashRes = await axios.get(
            "https://api.unsplash.com/search/photos",
            {
              params: {
                query: item.name,
                per_page: 1,
                client_id: process.env.UNSPLASH_ACCESS_KEY,
              },
            }
          );
          if (unsplashRes.data.results.length > 0) {
            imageUrl = unsplashRes.data.results[0].urls.regular;
          }
        } catch (err) {
          console.log("Unsplash Error:", err.message);
        }

        // --- B. FETCH NUTRISI DARI SPOONACULAR ---
        let nutrition = {
          calories: "N/A",
          protein: "N/A",
          fat: "N/A",
          readyInMinutes: 30,
        };
        try {
          const spoonRes = await axios.get(
            `https://api.spoonacular.com/recipes/complexSearch`,
            {
              params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                query: item.name,
                number: 1,
                addRecipeNutrition: true,
              },
            }
          );

          const spoonData = spoonRes.data.results[0];
          if (spoonData) {
            nutrition = {
              calories:
                spoonData.nutrition.nutrients.find((n) => n.name === "Calories")
                  ?.amount + " kcal",
              protein:
                spoonData.nutrition.nutrients.find((n) => n.name === "Protein")
                  ?.amount + " g",
              fat:
                spoonData.nutrition.nutrients.find(
                  (n) => n.name === "Fat" || n.name === "Total Fat"
                )?.amount + " g",
              readyInMinutes: spoonData.readyInMinutes || 30,
            };
          }
        } catch (err) {
          console.log("Spoonacular Error:", err.message);
        }

        // --- C. GABUNGKAN DATA ---
        return {
          title: item.name,
          ingredients: item.ingredients,
          instructions: item.instructions,
          image: imageUrl, // Pakai gambar Unsplash
          ...nutrition, // Spread data nutrisi
        };
      });

      const finalRecipes = await Promise.all(recipePromises);

      res.status(200).json({
        mood: mood,
        recipes: finalRecipes,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = AiController;
