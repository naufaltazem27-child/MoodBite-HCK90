const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

class AiController {
  static async getRecommendation(req, res, next) {
    try {
      const { mood } = req.body;
      if (!mood) throw { name: "MoodRequired" };

      // === 1. TANYA GEMINI ===
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // --- PERBAIKAN PROMPT DI SINI ---
      const prompt = `
        I am feeling ${mood}. 
        Suggest 3 distinct meals that fit this mood. 
        
        CRITICAL INSTRUCTION FOR "name":
        - Use VERY SIMPLE, STANDARD, and COMMON food names (e.g., "Chicken Steak", "Corn Porridge", "Creamy Mushroom Soup", "Fried Rice").
        - DO NOT use flowery adjectives or creative descriptions (Avoid: "Grandma's Cozy Soup", "Zesty Lemon Chicken", "Hearty Stew").
        - Keep the name short (max 3-4 words).

        For each meal, provide:
        1. 'name' (The simple food name)
        2. 'ingredients' (List of strings WITH measurements, e.g., "1 cup Rice")
        3. 'instructions' (Array of strings, step-by-step cooking guide)
        
        Return the result ONLY as a valid JSON array of objects.
        Strict JSON Format example:
        [
          { 
            "name": "Chicken Soup", 
            "ingredients": ["500g Chicken", "1 liter Water"],
            "instructions": ["Boil water", "Add chicken"]
          }
        ]
        Do not add markdown formatting.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response
        .text()
        .trim()
        .replace(/```json|```/g, "")
        .trim();
      const aiRecommendations = JSON.parse(responseText);

      // === 2. CARI GAMBAR & NUTRISI DI SPOONACULAR ===
      const recipePromises = aiRecommendations.map(async (item) => {
        const spoonUrl = `https://api.spoonacular.com/recipes/complexSearch`;

        // Helper function fetch
        const fetchSpoonacular = async (queryName) => {
          return await axios.get(spoonUrl, {
            params: {
              apiKey: process.env.SPOONACULAR_API_KEY,
              query: queryName,
              number: 1,
              addRecipeNutrition: true,
            },
          });
        };

        try {
          // Percobaan 1: Cari dengan nama dari Gemini (Sekarang sudah simple)
          let response = await fetchSpoonacular(item.name);

          // Percobaan 2 (Retry Logic): Jaga-jaga kalau masih tidak ketemu
          if (response.data.results.length === 0) {
            // Ambil 2 kata pertama saja. Ex: "Creamy Corn Soup" -> "Creamy Corn"
            const simpleName = item.name.split(" ").slice(0, 2).join(" ");
            console.log(
              `Retry search for '${item.name}' using '${simpleName}'...`
            );
            response = await fetchSpoonacular(simpleName);
          }

          const recipeData = response.data.results[0];

          // DATA GABUNGAN
          if (recipeData) {
            return {
              title: item.name,
              ingredients: item.ingredients,
              instructions: item.instructions,

              // Data Spoonacular
              imageUrl: recipeData.image,
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
              readyInMinutes: recipeData.readyInMinutes || 30,
            };
          } else {
            // Fallback terakhir
            return {
              title: item.name,
              ingredients: item.ingredients,
              instructions: item.instructions,
              imageUrl: "https://placehold.co/600x400?text=No+Image+Found",
              calories: "N/A",
              protein: "N/A",
              fat: "N/A",
              readyInMinutes: 30,
            };
          }
        } catch (err) {
          console.log(`Error fetching details for ${item.name}:`, err.message);
          return {
            title: item.name,
            ingredients: item.ingredients,
            instructions: item.instructions,
            imageUrl: "https://placehold.co/600x400?text=API+Error",
            calories: "N/A",
            protein: "N/A",
            fat: "N/A",
            readyInMinutes: 30,
          };
        }
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
